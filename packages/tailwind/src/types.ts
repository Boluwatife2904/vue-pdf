import type { Style } from '@vue-pdf/stylesheet';

export interface TwOptions {
  ptPerRem?: number;
}

export interface TwTheme {
  colors?: Record<string, string | Record<string, string>>;
  spacing?: Record<string, string | number>;
  fontFamily?: Record<string, string | string[]>;
  fontSize?: Record<string, string | [string, { lineHeight?: string }]>;
  fontWeight?: Record<string, string | number>;
  borderRadius?: Record<string, string | number>;
  borderWidth?: Record<string, string | number>;
  opacity?: Record<string, string | number>;
  zIndex?: Record<string, string | number>;
  letterSpacing?: Record<string, string | number>;
  lineHeight?: Record<string, string | number>;
  maxWidth?: Record<string, string | number>;
  extend?: Partial<TwTheme>;
}

export type TwFn = (classes: string) => Style;
