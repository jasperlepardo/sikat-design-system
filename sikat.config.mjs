/**
 * sikat.config.mjs — base (SIKAT) design-system config.
 *
 * Only sets brand fonts for now: code emits the full CSS stack (with fallbacks);
 * the Figma push uses the first family (a Figma font variable holds one real
 * family). `fonts` is NOT a token override, so the dev build still writes to the
 * package's normal paths (no temp dir).
 *
 * `palette` adds brand color families (brand/<name>) to raw next to Tailwind's (from the Figma
 * Tokens file, dhDHo6ZpJnAOpB3WUZoZFg). Primitives map roles onto them in
 * scripts/gen-primitives.mjs.
 */
export default {
  palette: {
    brand: {
      'sikat-orange': {
        50: '#fef8ec', 100: '#fcebc9', 200: '#f9d68e', 300: '#f5bb54', 400: '#f3a22c',
        500: '#e07912', 600: '#d15d0e', 700: '#ae3f0f', 800: '#8d3213', 900: '#742a13', 950: '#421306',
      },
      'sikat-coral': {
        50: '#fef2f2', 100: '#fee2e2', 200: '#fecacb', 300: '#fba6a7', 400: '#f66163',
        500: '#ee4547', 600: '#db2729', 700: '#b81d1f', 800: '#981c1e', 900: '#7e1e1f', 950: '#450a0b',
      },
    },
  },
  radius: { 'lg-plus': '0.625rem' },
  // 2xs: 10px / 12px line height (Tailwind has no 2xs).
  text: { '2xs': { size: '0.625rem', lineHeight: '0.75rem' } },
  fonts: {
    // Named sans families (raw font-family/sans/*); primitives map body → dm-sans,
    // heading → urbanist in scripts/gen-primitives.mjs.
    sans: {
      'dm-sans': "'DM Sans', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      inter: "'Inter', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
      urbanist: "'Urbanist', 'DM Sans', ui-sans-serif, system-ui, sans-serif",
    },
    serif: "'Georgia', ui-serif, Cambria, 'Times New Roman', Times, serif",
    mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
};
