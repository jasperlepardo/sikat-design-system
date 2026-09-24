/**
 * gen-primitives.mjs — (re)generate the PRIMITIVE tier from raw.json.
 *
 * Primitive is the brand layer: it renames raw's literal Tailwind palette into
 * semantic brand families (primary→brand/sikat-orange, success→green, …) and passes the
 * non-color scales straight through as aliases. Everything aliases raw 1:1, so
 * the only real content here is the brand color mapping + the arrangement.
 *
 * Arrangement mirrors raw's section order:
 *   color families: neutral, primary, success, warning, danger, information,
 *                   automation, white, black
 *   groups: color, spacing, radius, border-width, breakpoint, container, layout,
 *           font-family, font-size, font-weight, line-height, leading, tracking,
 *           shadow, blur
 * (The text composite lives at the semantic tier, not here.)
 *
 * Run: node scripts/gen-primitives.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { aliasShadowTree } from './lib/shadow.mjs';
import { loadConfig } from './lib/config.mjs';
import { toRem } from './lib/units.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const raw = JSON.parse(readFileSync(join(root, 'tokens/raw.json'), 'utf8')).raw;
const ctx = await loadConfig();

const SOLIDS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
// Alpha ramp — derived here (raw holds solids only, as in the Figma file): each
// level is the family's 500 solid at a clean opacity, so primary/a200 = primary-500 @ 20%.
const ALPHA = { a050: 0.05, a100: 0.1, a150: 0.15, a200: 0.2, a300: 0.3, a400: 0.4, a500: 0.5, a600: 0.6, a700: 0.7, a800: 0.8, a900: 0.9 };
const withAlpha = (val, a) => {
  const s = val.trim();
  if (s.startsWith('oklch(')) return s.replace(/\)\s*$/, ` / ${a})`);
  let h = s.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const ch = (i) => parseInt(h.slice(i, i + 2), 16);
  return `rgb(${ch(0)} ${ch(2)} ${ch(4)} / ${a})`;
};
const leaf = (value) => ({ value, type: 'color' });
const rawAt = (path) => path.split('.').reduce((o, k) => o[k], raw.color);
const alphaRamp = (solid) =>
  Object.fromEntries(Object.entries(ALPHA).map(([lvl, a]) => [lvl, leaf(withAlpha(solid, a))]));

// Brand color mapping (matches the Figma Tokens file). `path` is a raw color
// family: Tailwind's, or brand.* ramps from jspr.config `palette`.
const mapFamily = (path) => {
  const src = rawAt(path);
  const out = {};
  for (const s of SOLIDS) if (s in src) out[s] = leaf(`{raw.color.${path}.${s}}`);
  return { ...out, ...alphaRamp(src['500'].value) };
};

// neutral spans white→black: white/black anchors + the neutral ramp + its alpha.
const NEUTRAL = 'stone';
const neutral = {
  white: leaf('{raw.color.white.500}'),
  ...mapFamily(NEUTRAL),
  black: leaf('{raw.color.black.500}'),
};

// white/black: alpha-only overlays (solids live in neutral white/black) + transparent.
const overlay = (fam) => ({
  ...alphaRamp(raw.color[fam]['500'].value),
  transparent: leaf(withAlpha(raw.color[fam]['500'].value, 0)),
});

const color = {
  neutral,
  primary: mapFamily('brand.sikat-orange'),
  success: mapFamily('green'),
  warning: mapFamily('yellow'),
  danger: mapFamily('brand.sikat-coral'),
  information: mapFamily('sky'),
  automation: mapFamily('purple'),
  white: overlay('white'),
  black: overlay('black'),
};

// font-family — roles picked from raw's named families (Figma: body/heading only).
const FONT_ROLES = { body: 'sans.dm-sans', heading: 'sans.urbanist' };
const fontFamily = Object.fromEntries(
  Object.entries(FONT_ROLES).map(([role, path]) => [role, { value: `{raw.font-family.${path}}`, type: 'fontFamily' }]),
);

// Exact unitless ratio of a Tailwind line-height (`calc(a / b)` or a number) —
// unrounded, so size × ratio lands on whole px (lg: 1.125 × 1.75/1.125 = 1.75rem).
const ratio = (v) => {
  const m = String(v).match(/^calc\(\s*([\d.]+)\s*\/\s*([\d.]+)\s*\)$/);
  return m ? m[1] / m[2] : parseFloat(v);
};

// line-height — absolute (rem → px in Figma), one per font size: Tailwind's
// size × its raw ratio, or the jspr.config `text.<size>.lineHeight` for brand sizes.
const lineHeight = {};
for (const [k, size] of Object.entries(raw['font-size'])) {
  const lh = raw['line-height'][k]
    ? `${+(toRem(size.value) * ratio(raw['line-height'][k].value)).toFixed(4)}rem`
    : ctx.text?.[k]?.lineHeight;
  if (!lh) throw new Error(`no line-height for font-size ${k} (add jspr.config text.${k}.lineHeight)`);
  lineHeight[k] = { value: lh, type: 'dimension' };
}

// Passthrough scale: alias every raw key 1:1, mirroring the raw leaf's type.
const passthrough = (group) => {
  const out = {};
  for (const [k, leaf] of Object.entries(raw[group]))
    out[k] = { value: `{raw.${group}.${k}}`, type: leaf.type };
  return out;
};

// layout — Screen/Column pass through raw 1:1; Grid maps each platform
// (Web/iOS/Android) onto raw column widths + grid count/gutter, mirroring Figma's
// primitive layout. (The text composite lives at the SEMANTIC tier, not here.)
const passLayout = (sub) =>
  Object.fromEntries(
    Object.keys(raw.layout[sub]).map((k) => [k, { value: `{raw.layout.${sub}.${k}}`, type: 'dimension' }]),
  );
const gridCount = (k) => ({ value: `{raw.layout.Grid.count.${k}}`, type: 'number' });
const gridWidth = (k) => ({ value: `{raw.layout.Column.${k}}`, type: 'dimension' });
const gridGutter = (k) => ({ value: `{raw.layout.Grid.gutter.${k}}`, type: 'dimension' });
const layout = {
  Screen: passLayout('Screen'),
  Column: passLayout('Column'),
  Grid: {
    Web: { count: gridCount(12), width: gridWidth(84), gutter: gridGutter(24) },
    iOS: { count: gridCount(4), width: gridWidth(74), gutter: gridGutter(16) },
    Android: { count: gridCount(4), width: gridWidth(70), gutter: gridGutter(16) },
  },
};

const out = {
  primitive: {
    color,
    spacing: passthrough('spacing'),
    radius: passthrough('radius'),
    'border-width': passthrough('border-width'),
    breakpoint: passthrough('breakpoint'),
    container: passthrough('container'),
    layout,
    'font-family': fontFamily,
    'font-size': passthrough('font-size'),
    'font-weight': passthrough('font-weight'),
    'line-height': lineHeight,
    leading: passthrough('leading'),
    tracking: passthrough('tracking'),
    shadow: aliasShadowTree(raw.shadow, 'raw', 'primitive'),
    blur: passthrough('blur'),
  },
};

writeFileSync(join(root, 'tokens/primitives.json'), JSON.stringify(out, null, 2) + '\n');

const n = (o) => Object.values(o).reduce((a, v) => a + (v.value ? 1 : n(v)), 0);
console.log(
  `✓ primitives.json — ${Object.keys(color).length} color families, ` +
    `${n(color)} color tokens, groups: ${Object.keys(out.primitive).join(', ')}`,
);
