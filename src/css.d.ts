// Allow side-effect imports of CSS files in TS.
declare module '*.css';

// Static assets (Vite resolves these to URLs; library builds inline them).
declare module '*.svg' {
  const src: string;
  export default src;
}
declare module '*.png' {
  const src: string;
  export default src;
}
declare module '*.jpg' {
  const src: string;
  export default src;
}
