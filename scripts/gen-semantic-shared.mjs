/**
 * gen-semantic-shared.mjs — (re)generate tokens/semantics/shared.json from primitives.
 *
 * The mode-less semantic layer, aligned to the Figma 03 Semantics collection:
 *   scales: spacing, rounded (←radius), border-width, container, blur, breakpoint
 *   layout: role-named (Column Web/iOS/Android 1…n, Page, Grid) → primitive layout
 *   text:   text.{body,heading}.<size>: the type ramp (font-family/font-size/
 *           line-height/letter-spacing per size) + text.<weight>: weight roles
 *   shadow: aliases the primitive shadow decomposition
 *
 * Semantic COLORS live in light.json / dark.json (gen-semantic-color), not here.
 * Run: node scripts/gen-semantic-shared.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { aliasShadowTree } from './lib/shadow.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const prim = JSON.parse(readFileSync(join(root, 'tokens/primitives.json'), 'utf8')).primitive;

// passthrough a primitive scale 1:1
const pass = (group) =>
  Object.fromEntries(
    Object.keys(prim[group]).map((k) => [k, { value: `{primitive.${group}.${k}}`, type: 'dimension' }]),
  );

// rounded ← primitive.radius (renamed group)
const rounded = Object.fromEntries(
  Object.keys(prim.radius).map((k) => [k, { value: `{primitive.radius.${k}}`, type: 'dimension' }]),
);

// text — Figma's type tokens:
//   text/body/<size>/*, text/heading/<size>/*  the ramp (family/size/line-height/tracking)
//   text/<weight>                              weight roles (text/semibold = 600, …)
const ramp = (family) => {
  const out = {};
  for (const size of Object.keys(prim['font-size']))
    out[size] = {
      'font-family': { value: `{primitive.font-family.${family}}`, type: 'fontFamily' },
      'font-size': { value: `{primitive.font-size.${size}}`, type: 'dimension' },
      'line-height': { value: `{primitive.line-height.${size}}`, type: 'dimension' },
      'letter-spacing': { value: '{primitive.tracking.normal}', type: 'dimension' },
    };
  return out;
};
const text = { heading: ramp('heading'), body: ramp('body') };
for (const w of Object.keys(prim['font-weight']))
  text[w] = { value: `{primitive.font-weight.${w}}`, type: 'fontWeight' };

// layout — role names mapped onto the primitive layout values (Web/iOS/Android).
const dim = (p) => ({ value: `{${p}}`, type: 'dimension' });
const num = (p) => ({ value: `{${p}}`, type: 'number' });
const cols = (vals) => Object.fromEntries(vals.map((v, i) => [i + 1, dim(`primitive.layout.Column.${v}`)]));
const grid = (plat) => ({
  count: num(`primitive.layout.Grid.${plat}.count`),
  width: dim(`primitive.layout.Grid.${plat}.width`),
  gutter: dim(`primitive.layout.Grid.${plat}.gutter`),
});
const layout = {
  Column: {
    Web: cols([84, 192, 300, 408, 516, 624, 732, 840, 948, 1056, 1164, 1272]),
    iOS: cols([74, 164, 253, 343]),
    Android: cols([70, 156, 242, 328]),
  },
  Page: {
    Web: { 'min-width': dim('primitive.layout.Screen.1440'), height: dim('primitive.layout.Screen.1024'), 'max-width': dim('primitive.layout.Screen.1920') },
    iOS: { width: dim('primitive.layout.Screen.375'), height: dim('primitive.layout.Screen.812') },
    Android: { width: dim('primitive.layout.Screen.360'), height: dim('primitive.layout.Screen.800') },
  },
  Grid: { Web: grid('Web'), iOS: grid('iOS'), Android: grid('Android') },
};

const out = {
  semantic: {
    spacing: pass('spacing'),
    rounded,
    'border-width': pass('border-width'),
    container: pass('container'),
    blur: pass('blur'),
    breakpoint: pass('breakpoint'),
    layout,
    text,
    shadow: aliasShadowTree(prim.shadow, 'primitive', 'semantic'),
  },
};

writeFileSync(join(root, 'tokens/semantics/shared.json'), JSON.stringify(out, null, 2) + '\n');
const n = (o) => Object.values(o).reduce((a, v) => a + (v.value ? 1 : n(v)), 0);
console.log(`✓ shared.json — ${n(out.semantic)} tokens, groups: ${Object.keys(out.semantic).join(', ')}`);
