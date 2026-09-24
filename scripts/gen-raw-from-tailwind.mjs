/**
 * gen-raw-from-tailwind.mjs — derive the entire RAW tier from Tailwind's own
 * default theme, so "raw" is literally Tailwind: colors, spacing, radius,
 * typography (font family/size/weight, line-height, tracking) and shadows.
 *
 * Tailwind v4 ships its theme as CSS custom properties in the package's
 * `theme.css`. We parse those and emit raw.json as a Style-Dictionary tree.
 * Tailwind is resolved from the CONSUMER's repo (their palette), falling back to
 * this package's own install for the dev flow. Output path comes from the ctx.
 *
 * Run: npm run tokens:raw  (or `sikat gen tokens`)
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { loadConfig } from './lib/config.mjs';
import { rawShadowTree } from './lib/shadow.mjs';
import { toRem } from './lib/units.mjs';

// Locate Tailwind's theme.css (where the default theme lives in v4), resolving
// from the consumer cwd first so their installed Tailwind wins.
function findThemeCss(cwd) {
  const require = createRequire(join(cwd, 'package.json'));
  const pkgDir = dirname(require.resolve('tailwindcss/package.json'));
  for (const candidate of ['theme.css', 'dist/theme.css', 'lib/theme.css']) {
    const p = join(pkgDir, candidate);
    try {
      readFileSync(p, 'utf8');
      return p;
    } catch {
      /* try next */
    }
  }
  throw new Error(
    'Could not find Tailwind theme.css. Is `tailwindcss` v4 installed? (npm install)',
  );
}

const clean = (v) => v.replace(/\s+/g, ' ').trim();
const dim = (value) => ({ value, type: 'dimension' });
const node = (value, type) => ({ value, type });

export async function run(ctx) {
  const css = readFileSync(findThemeCss(ctx.cwd), 'utf8');

  // Pull every `--<prefix>-<key>: <value>;` declaration into { key: value }.
  // Anchored + `m` flag so e.g. `--shadow-` can't match inside `--text-shadow-`.
  function collect(prefix, keyPattern = '[a-z0-9]+') {
    const re = new RegExp(`^\\s*--${prefix}-(${keyPattern}):\\s*([^;]+);`, 'gm');
    const out = {};
    let m;
    while ((m = re.exec(css))) out[m[1]] = clean(m[2]);
    return out;
  }

  /* ---- color (all families + black/white) ---- */
  const color = {};
  {
    const shaded = /^\s*--color-([a-z]+)-(\d+):\s*([^;]+);/gm;
    const flat = /^\s*--color-(black|white):\s*([^;]+);/gm;
    let m;
    while ((m = shaded.exec(css))) (color[m[1]] ??= {})[m[2]] = node(clean(m[3]), 'color');
    while ((m = flat.exec(css))) color[m[1]] = node(clean(m[2]), 'color');
  }
  if (Object.keys(color).length === 0)
    throw new Error('Parsed 0 colors from Tailwind theme.css — the format may have changed.');
  // Brand families from sikat.config `palette` (custom ramps Tailwind doesn't ship).
  // A value is either a ramp { 50…950 } or a group of ramps (e.g. brand/<name>).
  const ramp = (shades) => Object.fromEntries(Object.entries(shades).map(([s, v]) => [s, node(v, 'color')]));
  const isRamp = (o) => Object.values(o).every((v) => typeof v === 'string');
  for (const [fam, spec] of Object.entries(ctx?.palette ?? {})) {
    if (color[fam]) throw new Error(`palette.${fam} would overwrite Tailwind's ${fam} family`);
    color[fam] = isRamp(spec)
      ? ramp(spec)
      : Object.fromEntries(Object.entries(spec).map(([name, shades]) => [name, ramp(shades)]));
  }
  const familyCount = Object.keys(color).length;

  // white/black: a single solid (500). Alpha ramps + transparent are derived at
  // the primitive tier (scripts/gen-primitives.mjs), matching the Figma file.
  for (const k of ['white', 'black']) color[k] = { 500: node(color[k].value, 'color') };

  /* ---- arrange: brand, white/black, then spectrum, grays; each family's
     shades sorted 50…950. ---- */
  {
    const FAMILY_ORDER = [
      'brand', 'white', 'black',
      'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky',
      'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
      'slate', 'gray', 'zinc', 'neutral', 'stone',
      'mauve', 'olive', 'mist', 'taupe',
    ];
    const SHADE_ORDER = [
      '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950',
      'a050', 'a100', 'a150', 'a200', 'a300', 'a400', 'a500', 'a600', 'a700', 'a800', 'a900',
      'transparent',
    ];
    const ordered = {};
    for (const fam of [...FAMILY_ORDER, ...Object.keys(color)]) {
      if (!color[fam] || ordered[fam]) continue;
      const src = color[fam], dst = {};
      for (const s of SHADE_ORDER) if (s in src) dst[s] = src[s];
      for (const s in src) if (!(s in dst)) dst[s] = src[s];
      ordered[fam] = dst;
    }
    for (const k of Object.keys(color)) delete color[k];
    Object.assign(color, ordered);
  }

  /* ---- spacing (v4 ships a single --spacing multiplier; materialise steps) ---- */
  const SPACING_STEPS = [
    0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44,
    48, 52, 56, 60, 64, 72, 80, 96,
  ];
  const spacing = { 0: dim('0px'), px: dim('1px') };
  {
    // Multiplier precedence: sikat.config spacing.multiplier > Tailwind --spacing > 0.25rem.
    const baseMatch = css.match(/^\s*--spacing:\s*([^;]+);/m);
    const tailwindMult = baseMatch ? baseMatch[1] : '0.25rem';
    const remRoot = ctx?.spacing?.remRoot ?? 16;
    const baseRem = toRem(ctx?.spacing?.multiplier ?? tailwindMult, remRoot);
    // Tailwind's fractional steps (0.5/1.5/…) use a dot in the class name; keep
    // the token key CSS-safe by writing the dot as "_" (→ --raw-spacing-0_5).
    for (const step of SPACING_STEPS) {
      const key = String(step).replace('.', '_');
      spacing[key] = dim(`${+(step * baseRem).toFixed(4)}rem`);
    }
  }

  /* ---- radius — Tailwind's named scale (--radius-xs…4xl), kept verbatim so raw
     mirrors Tailwind in both CSS and Figma. Own scale (independent of the spacing
     multiplier); none/full are Tailwind's rounded-none/full utilities. ---- */
  const radius = { none: dim('0px') };
  for (const [k, v] of Object.entries(collect('radius'))) radius[k] = dim(v);
  // Brand steps from sikat.config `radius`, slotted in by size so the scale stays ordered.
  {
    const extra = ctx?.radius ?? {};
    for (const k of Object.keys(extra))
      if (k in radius) throw new Error(`radius.${k} would overwrite Tailwind's ${k} step`);
    const all = [...Object.entries(radius), ...Object.entries(extra).map(([k, v]) => [k, dim(v)])];
    const px = (v) => toRem(v.value, 16);
    all.sort((a, b) => px(a[1]) - px(b[1]));
    for (const k of Object.keys(radius)) delete radius[k];
    for (const [k, v] of all) radius[k] = v;
  }
  radius.full = dim('calc(infinity * 1px)');

  /* ---- border width (Tailwind has no theme vars — these are its utilities) ---- */
  const borderWidth = { 0: dim('0px'), 1: dim('1px'), 2: dim('2px'), 4: dim('4px'), 8: dim('8px') };

  /* ---- breakpoints + containers (Tailwind ships --breakpoint-* / --container-*) ---- */
  const breakpoint = Object.fromEntries(
    Object.entries(collect('breakpoint')).map(([k, v]) => [k, dim(v)]),
  );
  const container = Object.fromEntries(
    Object.entries(collect('container')).map(([k, v]) => [k, dim(v)]),
  );

  /* ---- layout — custom responsive grid (NOT from Tailwind): screen sizes, column
     widths, grid count + gutter. Base values keyed by value, mirroring the Figma
     raw `layout/*` tree; primitives/semantics name them (Web/iOS/Android, 1…12). ---- */
  const layout = {
    Screen: Object.fromEntries(
      ['360', '375', '800', '812', '1024', '1440', '1920'].map((v) => [v, dim(`${v}px`)]),
    ),
    Column: Object.fromEntries(
      ['70', '74', '84', '156', '164', '192', '242', '253', '300', '328', '343', '408', '516',
        '624', '732', '840', '948', '1056', '1164', '1272'].map((v) => [v, dim(`${v}px`)]),
    ),
    Grid: {
      count: { 4: node(4, 'number'), 12: node(12, 'number') },
      gutter: { 16: dim('16px'), 24: dim('24px') },
    },
  };

  /* ---- typography. Font families default to Tailwind's generic stacks; a
     sikat.config `fonts.{sans,serif,mono}` overrides with brand stacks. ---- */
  const fontFamily = Object.fromEntries(
    Object.entries(collect('font', 'sans|serif|mono')).map(([k, v]) => [k, node(v, 'fontFamily')]),
  );
  // A config entry is a stack string, or (sans) a group of named stacks
  // (sans/dm-sans, sans/inter, …) that primitives pick body/heading from.
  for (const k of ['sans', 'serif', 'mono']) {
    const f = ctx?.fonts?.[k];
    if (typeof f === 'string') fontFamily[k] = node(f, 'fontFamily');
    else if (f)
      fontFamily[k] = Object.fromEntries(Object.entries(f).map(([n, v]) => [n, node(v, 'fontFamily')]));
  }
  const fontWeight = Object.fromEntries(
    // Tailwind's `normal` (400) is named `regular`, as in the Figma file.
    Object.entries(collect('font-weight', '[a-z]+')).map(([k, v]) => [k === 'normal' ? 'regular' : k, node(v, 'fontWeight')]),
  );
  let fontSize = Object.fromEntries(Object.entries(collect('text')).map(([k, v]) => [k, dim(v)]));
  let lineHeight = {};
  {
    const re = /^\s*--text-([a-z0-9]+)--line-height:\s*([^;]+);/gm;
    let m;
    while ((m = re.exec(css))) lineHeight[m[1]] = dim(clean(m[2]));
  }
  // Brand type steps from sikat.config `text`, slotted in by size so both scales stay ordered.
  {
    const extra = ctx?.text ?? {};
    // Only the size lands in raw; its line-height is set at the primitive tier.
    for (const [k, { size }] of Object.entries(extra)) {
      if (k in fontSize) throw new Error(`text.${k} would overwrite Tailwind's ${k} size`);
      fontSize[k] = dim(size);
    }
    const order = Object.keys(fontSize).sort((a, b) => toRem(fontSize[a].value) - toRem(fontSize[b].value));
    fontSize = Object.fromEntries(order.map((k) => [k, fontSize[k]]));
    lineHeight = Object.fromEntries(order.filter((k) => k in lineHeight).map((k) => [k, lineHeight[k]]));
  }
  const leading = Object.fromEntries(
    Object.entries(collect('leading', '[a-z]+')).map(([k, v]) => [k, dim(v)]),
  );
  const tracking = Object.fromEntries(
    Object.entries(collect('tracking', '[a-z]+')).map(([k, v]) => [k, dim(v)]),
  );

  /* ---- blur — Tailwind's --blur-* (px → Figma effect blur radius) ---- */
  const blur = Object.fromEntries(Object.entries(collect('blur')).map(([k, v]) => [k, dim(v)]));

  /* ---- shadows — decomposed into Figma-mappable parts (offset/blur/spread/color) ---- */
  const shadow = rawShadowTree(collect('shadow'));

  const out = {
    raw: {
      color,
      spacing,
      radius,
      'border-width': borderWidth,
      breakpoint,
      container,
      layout,
      'font-family': fontFamily,
      'font-size': fontSize,
      'font-weight': fontWeight,
      'line-height': lineHeight,
      leading,
      tracking,
      shadow,
      blur,
    },
  };

  const dest = ctx.paths.rawJsonPath;
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, JSON.stringify(out, null, 2) + '\n');

  const count = (o) =>
    Object.values(o).reduce((n, v) => n + (v.value ? 1 : Object.keys(v).length), 0);
  console.log(
    `✓ raw.json — from Tailwind: ${count(color)} colors (${familyCount} families), ` +
      `${count(spacing)} spacing, ${count(radius)} radius, ${count(fontSize)} font-size, ` +
      `${count(lineHeight)} line-height, ${count(fontWeight)} font-weight, ${count(shadow)} shadow`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run(await loadConfig());
}
