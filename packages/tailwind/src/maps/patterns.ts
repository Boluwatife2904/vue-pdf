import { isArbitraryValue, parseArbitraryValue, resolveFraction } from '../utils';

type ValueFn = (
  value: string,
  extra?: { ptPerRem: number; theme: Record<string, any>; colors: Record<string, any> },
) => any;

export const patternUtils: Record<string, ValueFn> = {
  p: (v, opts) => {
    const num = resolveNumeric(v, opts);
    return { padding: num };
  },
  px: (v, opts) => {
    const num = resolveNumeric(v, opts);
    return { paddingHorizontal: num };
  },
  py: (v, opts) => {
    const num = resolveNumeric(v, opts);
    return { paddingVertical: num };
  },
  pt: (v, opts) => ({ paddingTop: resolveNumeric(v, opts) }),
  pr: (v, opts) => ({ paddingRight: resolveNumeric(v, opts) }),
  pb: (v, opts) => ({ paddingBottom: resolveNumeric(v, opts) }),
  pl: (v, opts) => ({ paddingLeft: resolveNumeric(v, opts) }),

  m: (v, opts) => ({ margin: resolveNumeric(v, opts) }),
  mx: (v, opts) => ({ marginHorizontal: resolveNumeric(v, opts) }),
  my: (v, opts) => ({ marginVertical: resolveNumeric(v, opts) }),
  mt: (v, opts) => ({ marginTop: resolveNumeric(v, opts) }),
  mr: (v, opts) => ({ marginRight: resolveNumeric(v, opts) }),
  mb: (v, opts) => ({ marginBottom: resolveNumeric(v, opts) }),
  ml: (v, opts) => ({ marginLeft: resolveNumeric(v, opts) }),

  w: (v, opts) => ({ width: resolveDimension(v, opts) }),
  h: (v, opts) => ({ height: resolveDimension(v, opts) }),

  'min-w': (v, opts) => ({ minWidth: resolveDimension(v, opts) }),
  'max-w': (v, opts) => ({ maxWidth: resolveDimension(v, opts) }),
  'min-h': (v, opts) => ({ minHeight: resolveDimension(v, opts) }),
  'max-h': (v, opts) => ({ maxHeight: resolveDimension(v, opts) }),

  gap: (v, opts) => ({ gap: resolveNumeric(v, opts) }),
  'gap-x': (v, opts) => ({ columnGap: resolveNumeric(v, opts) }),
  'gap-y': (v, opts) => ({ rowGap: resolveNumeric(v, opts) }),

  top: (v, opts) => ({ top: resolveNumeric(v, opts) }),
  right: (v, opts) => ({ right: resolveNumeric(v, opts) }),
  bottom: (v, opts) => ({ bottom: resolveNumeric(v, opts) }),
  left: (v, opts) => ({ left: resolveNumeric(v, opts) }),
  inset: (v, opts) => ({ top: resolveNumeric(v, opts), right: resolveNumeric(v, opts), bottom: resolveNumeric(v, opts), left: resolveNumeric(v, opts) }),

 'inset-x': (v, opts) => ({ left: resolveNumeric(v, opts), right: resolveNumeric(v, opts) }),
  'inset-y': (v, opts) => ({ top: resolveNumeric(v, opts), bottom: resolveNumeric(v, opts) }),

  z: (v, opts) => {
    const themeVal = opts?.theme.zIndex?.[v];
    if (themeVal !== undefined && themeVal !== 'auto') return { zIndex: parseInt(themeVal as string, 10) };
    if (isArbitraryValue(v)) return { zIndex: parseInt(parseArbitraryValue(v), 10) };
    const n = parseInt(v, 10);
    if (!isNaN(n)) return { zIndex: n };
    return null;
  },

  text: (v, opts) => {
    if (!opts) return null;
    const { theme, colors } = opts;

    if (v === 'xs' || v === 'sm' || v === 'base' || v === 'lg' || v === 'xl' ||
        v === '2xl' || v === '3xl' || v === '4xl' || v === '5xl' ||
        v === '6xl' || v === '7xl' || v === '8xl' || v === '9xl') {
      const fontSizeConfig = theme.fontSize?.[v];
      if (fontSizeConfig) {
        const [size, config] = Array.isArray(fontSizeConfig) ? fontSizeConfig : [fontSizeConfig, {}];
        const style: any = {
          fontSize: stageValue(size as string, opts),
        };
        if ((config as any)?.lineHeight) {
          style.lineHeight = stageValue((config as any).lineHeight, opts);
        }
        return style;
      }
    }

    const color = resolveColor(colors, v);
    if (color) return { color };

    return null;
  },

  bg: (v, opts) => {
    if (!opts) return null;
    const color = resolveColor(opts.colors, v);
    if (color) return { backgroundColor: color };
    return null;
  },

  opacity: (v, _opts) => {
    const n = parseFloat(v);
    if (!isNaN(n)) return { opacity: n / 100 };
    if (isArbitraryValue(v)) return { opacity: parseFloat(parseArbitraryValue(v)) };
    return null;
  },

  font: (v, _opts) => {
    const weights: Record<string, string | number> = {
      thin: 100, extralight: 200, light: 300, normal: 400,
      medium: 500, semibold: 600, bold: 700, extrabold: 800, black: 900,
    };
    if (v === 'sans') return { fontFamily: 'sans-serif' };
    if (v === 'serif') return { fontFamily: 'serif' };
    if (v === 'mono') return { fontFamily: 'monospace' };
    if (weights[v]) return { fontWeight: weights[v] };
    return null;
  },

  leading: (v, opts) => {
    const themeVal = opts?.theme.lineHeight?.[v];
    if (themeVal !== undefined) return { lineHeight: stageValue(themeVal, opts) };
    if (isArbitraryValue(v)) return { lineHeight: stageValue(parseArbitraryValue(v), opts) };
    const n = parseFloat(v);
    if (!isNaN(n)) return { lineHeight: n };
    return null;
  },

  tracking: (v, opts) => {
    const themeVal = opts?.theme.letterSpacing?.[v];
    if (themeVal !== undefined) return { letterSpacing: stageValue(themeVal, opts) };
    if (isArbitraryValue(v)) return { letterSpacing: stageValue(parseArbitraryValue(v), opts) };
    return null;
  },

  rounded: (v, opts) => {
    if (v === 'none') return { borderRadius: 0 };
    if (v === 'full') return { borderRadius: 9999 };
    const themeVal = opts?.theme.borderRadius?.[v];
    if (themeVal !== undefined) return { borderRadius: stageValue(themeVal, opts) };
    if (isArbitraryValue(v)) return { borderRadius: stageValue(parseArbitraryValue(v), opts) };
    const n = parseFloat(v);
    if (!isNaN(n)) return { borderRadius: n };
    return null;
  },
  'rounded-t': (v, opts) => {
    const val = resolveNumeric(v, opts);
    return { borderTopLeftRadius: val, borderTopRightRadius: val };
  },
  'rounded-b': (v, opts) => {
    const val = resolveNumeric(v, opts);
    return { borderBottomLeftRadius: val, borderBottomRightRadius: val };
  },
  'rounded-l': (v, opts) => {
    const val = resolveNumeric(v, opts);
    return { borderTopLeftRadius: val, borderBottomLeftRadius: val };
  },
  'rounded-r': (v, opts) => {
    const val = resolveNumeric(v, opts);
    return { borderTopRightRadius: val, borderBottomRightRadius: val };
  },
  'rounded-tl': (v, opts) => ({ borderTopLeftRadius: resolveNumeric(v, opts) }),
  'rounded-tr': (v, opts) => ({ borderTopRightRadius: resolveNumeric(v, opts) }),
  'rounded-bl': (v, opts) => ({ borderBottomLeftRadius: resolveNumeric(v, opts) }),
  'rounded-br': (v, opts) => ({ borderBottomRightRadius: resolveNumeric(v, opts) }),

  border: (v, opts) => {
    if (v === '0') return { borderWidth: 0 };
    if (v === '2') return { borderWidth: 2 };
    if (v === '4') return { borderWidth: 4 };
    if (v === '8') return { borderWidth: 8 };
    const color = resolveColor(opts?.colors, v);
    if (color) return { borderColor: color };
    if (isArbitraryValue(v)) return { borderWidth: stageValue(parseArbitraryValue(v), opts) };
    return null;
  },
  'border-t': (v, opts) => ({ borderTopWidth: resolveNumeric(v, opts) }),
  'border-r': (v, opts) => ({ borderRightWidth: resolveNumeric(v, opts) }),
  'border-b': (v, opts) => ({ borderBottomWidth: resolveNumeric(v, opts) }),
  'border-l': (v, opts) => ({ borderLeftWidth: resolveNumeric(v, opts) }),

  basis: (v, opts) => {
    const frac = resolveFraction(v);
    if (frac) return { flexBasis: frac };
    return { flexBasis: resolveNumeric(v, opts) };
  },

  grow: (v, opts) => ({ flexGrow: resolveNumeric(v, opts) }),
  shrink: (v, opts) => ({ flexShrink: resolveNumeric(v, opts) }),

  'aspect-video': (_v, _opts) => ({ aspectRatio: 16 / 9 }),
  'aspect-square': (_v, _opts) => ({ aspectRatio: 1 }),

  fill: (v, opts) => {
    if (!opts) return null;
    const color = resolveColor(opts.colors, v);
    if (color) return { fill: color } as any;
    return null;
  },

  stroke: (v, opts) => {
    if (!opts) return null;
    const color = resolveColor(opts.colors, v);
    if (color) return { stroke: color } as any;
    if (isArbitraryValue(v)) return { stroke: stageValue(parseArbitraryValue(v), opts) } as any;
    return null;
  },

  decoration: (v, opts) => {
    if (!opts) return null;
    const color = resolveColor(opts.colors, v);
    if (color) return { textDecorationColor: color };
    return null;
  },
};

function resolveNumeric(v: string, opts?: { ptPerRem: number; theme: Record<string, any> }): number | string {
  if (v === 'px') return 1;
  if (v === 'auto') return 'auto';
  if (v === 'full') return '100%';

  if (isArbitraryValue(v)) {
    return stageValue(parseArbitraryValue(v), opts);
  }

  const frac = resolveFraction(v);
  if (frac) return frac;

  const themeSpacing = opts?.theme.spacing?.[v] ?? opts?.theme.spacing?.[v.replace('_', '.')];
  if (themeSpacing !== undefined) {
    return stageValue(themeSpacing as string, opts);
  }

  const n = parseFloat(v);
  if (!isNaN(n)) {
    return opts ? n * opts.ptPerRem : n;
  }
  return v;
}

function resolveDimension(v: string, opts?: { ptPerRem: number; theme: Record<string, any> }): number | string {
  if (v === 'px') return 1;
  if (v === 'auto') return 'auto';
  if (v === 'full') return '100%';
  if (v === 'screen') return '100vw';
  if (v === 'min') return 'min-content';
  if (v === 'max') return 'max-content';
  if (v === 'fit') return 'fit-content';

  if (isArbitraryValue(v)) {
    return stageValue(parseArbitraryValue(v), opts);
  }

  const frac = resolveFraction(v);
  if (frac) return frac;

  const themeSpacing = opts?.theme.spacing?.[v] ?? opts?.theme.spacing?.[v.replace('_', '.')];
  if (themeSpacing !== undefined) {
    return stageValue(themeSpacing as string, opts);
  }

  const themeMaxWidth = opts?.theme.maxWidth?.[v];
  if (themeMaxWidth !== undefined) {
    return stageValue(themeMaxWidth as string, opts);
  }

  const n = parseFloat(v);
  if (!isNaN(n)) {
    return opts ? n * opts.ptPerRem : n;
  }
  return v;
}

function stageValue(value: string | number, opts?: { ptPerRem: number }): number | string {
  if (typeof value === 'number') return value;
  const match = String(value).match(/^(-?\d*\.?\d+)(rem|px|pt|%|em)?$/);
  if (!match) return value;

  const num = parseFloat(match[1]);
  const unit = match[2];

  if (unit === 'rem' || unit === 'em') return opts ? num * opts.ptPerRem : num;
  if (unit === 'px' || unit === 'pt' || !unit) return num;
  if (unit === '%') return `${num}%`;
  return value;
}

function resolveThemeValue(theme: Record<string, any>, scale: string, token: string): any {
  const scaleObj = theme[scale];
  if (!scaleObj) return token;
  return scaleObj[token] ?? token;
}

function resolveColor(colors: Record<string, any> | undefined, value: string): string | undefined {
  if (!value || !colors) return undefined;
  if (isArbitraryValue(value)) return parseArbitraryValue(value);

  if (typeof colors[value] === 'string') return colors[value];

  const parts = value.split('-');
  const shade = parts[parts.length - 1];
  const name = parts.slice(0, -1).join('-');

  if (colors[name] && typeof colors[name] === 'object') {
    return colors[name][shade] ?? colors[name].DEFAULT;
  }

  return undefined;
}
