/**
 * shadow.mjs — decompose Tailwind composite box-shadows into 3-tier part tokens.
 *
 * A shadow can't be a single Figma variable, so each layer is split into parts:
 *   offset-x, offset-y, blur, spread  → dimension (FLOAT in Figma)
 *   color                             → color (literal black at the layer's alpha;
 *                                        raw holds solids only, so no alpha to alias)
 * The composite string is kept as a CSS-only `box` leaf (type "shadow"), which
 * the Figma sync skips. An effect style later binds each part to the semantic var.
 */

// Parse one box-shadow layer string → { inset, x, y, blur, spread, alpha }
function parseLayer(layer) {
  const inset = /(^|\s)inset(\s|$)/.test(layer);
  const colorMatch = layer.match(/rgba?\([^)]*\)|#[0-9a-fA-F]+|hsla?\([^)]*\)/);
  const color = colorMatch ? colorMatch[0] : 'rgb(0 0 0 / 1)';
  // alpha from `rgb(0 0 0 / 0.1)` or `rgba(0,0,0,0.1)`
  let alpha = 1;
  const slash = color.match(/\/\s*([\d.]+)\s*\)/);
  const rgba = color.match(/rgba\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*([\d.]+)/);
  if (slash) alpha = parseFloat(slash[1]);
  else if (rgba) alpha = parseFloat(rgba[1]);
  const rest = layer.replace(colorMatch ? colorMatch[0] : '', '').replace(/\binset\b/, '').trim();
  const nums = rest.split(/\s+/).filter(Boolean);
  const [x = '0', y = '0', blur = '0', spread = '0'] = nums;
  return { inset, x, y, blur, spread, alpha };
}

// Split a composite (top-level commas only — our shadows have no nested commas
// except inside rgb(), so split on ',' not within parens)
function splitLayers(composite) {
  const out = [];
  let depth = 0, cur = '';
  for (const ch of composite) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; }
    else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

const dim = (v) => ({ value: v, type: 'dimension' });

// Build the raw.shadow subtree from { size: compositeString }.
export function rawShadowTree(composites) {
  const tree = {};
  for (const [size, composite] of Object.entries(composites)) {
    // Figma-mappable parts only — the composite box-shadow string isn't a Figma
    // variable type, so it's not emitted; the decomposed parts carry it.
    const node = {};
    splitLayers(composite).forEach((layerStr, i) => {
      const L = parseLayer(layerStr);
      node[String(i + 1)] = {
        'offset-x': dim(L.x),
        'offset-y': dim(L.y),
        blur: dim(L.blur),
        spread: dim(L.spread),
        color: { value: `rgb(0 0 0 / ${L.alpha})`, type: 'color' },
      };
    });
    tree[size] = node;
  }
  return tree;
}

// Build a primitive/semantic passthrough that aliases the tier below.
// `from`/`to` are tier prefixes, e.g. ('raw','primitive') or ('primitive','semantic').
export function aliasShadowTree(rawTree, fromTier, toTier) {
  const out = {};
  for (const [size, node] of Object.entries(rawTree)) {
    out[size] = {};
    for (const [layer, parts] of Object.entries(node)) {
      if (layer === 'box') continue; // composite is CSS-only, not aliased
      out[size][layer] = {};
      for (const [field, leaf] of Object.entries(parts)) {
        out[size][layer][field] = {
          value: `{${fromTier}.shadow.${size}.${layer}.${field}}`,
          type: leaf.type,
        };
      }
    }
  }
  return out;
}
