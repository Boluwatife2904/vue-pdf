/**
 * react-pdf substitutes a BROWSER constant at build time (rollup replace).
 * This port ships raw sources, so the environment is detected at runtime.
 */
export const BROWSER =
  typeof window !== 'undefined' && typeof window.document !== 'undefined';
