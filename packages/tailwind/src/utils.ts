const PX_PER_PT = 0.75;
const FRACTION_RE = /^(\d+)\/(\d+)$/;

export const remToPt = (value: number, ptPerRem: number): number =>
  value * ptPerRem;

export const pxToPt = (value: number): number => value * PX_PER_PT;

export const parseNumeric = (value: string): number => {
  const n = parseFloat(value);
  return Number.isNaN(n) ? 0 : n;
};

export const splitPrefix = (
  className: string,
  prefixes: string[],
): { prefix: string; rest: string } | null => {
  const sorted = [...prefixes].sort((a, b) => b.length - a.length);
  for (const prefix of sorted) {
    if (className === prefix) return { prefix, rest: '' };
    if (className.startsWith(prefix + '-') || className.startsWith(prefix)) {
      const rest = className.slice(prefix.length);
      if (rest === '') return { prefix, rest: '' };
      if (rest.startsWith('-')) return { prefix, rest: rest.slice(1) };
    }
  }
  return null;
};

export const isNegative = (className: string): boolean =>
  className.startsWith('-');

export const stripNegative = (className: string): string =>
  className.replace(/^-/, '');

export const resolveFraction = (value: string): string | null => {
  const match = value.match(FRACTION_RE);
  if (!match) return null;
  const num = parseFloat(match[1]);
  const denom = parseFloat(match[2]);
  if (denom === 0) return null;
  return `${(num / denom) * 100}%`;
};

export const isArbitraryValue = (value: string): boolean =>
  /^\[.+\]$/.test(value);

export const parseArbitraryValue = (value: string): string =>
  value.slice(1, -1);

const UNIT_RE = /^(-?\d*\.?\d+)(rem|px|pt|em|%|vh|vw)?$/;

export const transformValue = (
  value: string,
  ptPerRem: number,
): string | number => {
  const match = value.match(UNIT_RE);
  if (!match) return value;

  const num = parseFloat(match[1]);
  const unit = match[2];

  if (unit === 'rem' || unit === 'em') {
    return remToPt(num, ptPerRem);
  }
  if (unit === 'px') {
    return pxToPt(num);
  }
  if (unit === 'pt') {
    return num;
  }
  if (unit === '%') {
    return `${num}%`;
  }
  if (unit === 'vh' || unit === 'vw') {
    return `${num}${unit}`;
  }
  return num;
};

export const resolveThemeValue = (
  theme: Record<string, any>,
  scale: string,
  token: string,
): any => {
  if (isArbitraryValue(token)) {
    return parseArbitraryValue(token);
  }
  const scaleObj = theme[scale];
  if (!scaleObj) return token;
  return scaleObj[token] ?? token;
};

export const applyNegative = (
  style: Record<string, unknown>,
  isNeg: boolean,
): Record<string, unknown> => {
  if (!isNeg) return style;
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(style)) {
    if (typeof value === 'number') {
      result[key] = -value;
    } else if (typeof value === 'string' && /^-?\d/.test(value)) {
      result[key] = value.startsWith('-') ? value.slice(1) : `-${value}`;
    } else {
      result[key] = value;
    }
  }
  return result;
};

export const merge = (
  ...objects: Record<string, unknown>[]
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const obj of objects) {
    for (const key of Object.keys(obj)) {
      if (obj[key] !== undefined) {
        result[key] = obj[key];
      }
    }
  }
  return result;
};

export const deepMerge = <T extends Record<string, any>>(
  target: T,
  source: T | undefined,
): T => {
  if (!source) return target;
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      typeof result[key] === 'object' &&
      !Array.isArray(result[key])
    ) {
      (result as any)[key] = deepMerge(result[key], source[key]);
    } else {
      (result as any)[key] = source[key];
    }
  }
  return result;
};

export const resolveColor = (
  colors: Record<string, any>,
  value: string,
): string | undefined => {
  if (!value) return undefined;

  if (isArbitraryValue(value)) {
    return parseArbitraryValue(value);
  }

  if (colors[value]) {
    const c = colors[value];
    return typeof c === 'string' ? c : c.DEFAULT ?? undefined;
  }

  const parts = value.split('-');
  const shade = parts[parts.length - 1];
  const colorName = parts.slice(0, -1).join('-');

  if (colors[colorName] && typeof colors[colorName] === 'object') {
    const colorScale = colors[colorName] as Record<string, string>;
    return colorScale[shade] ?? colorScale.DEFAULT ?? undefined;
  }

  return colors[value] as string | undefined;
};

export const parseAlpha = (
  hex: string,
  alpha: number,
): string | undefined => {
  if (!/^#[0-9a-fA-F]{3,6}$/.test(hex)) return undefined;
  let h = hex.replace('#', '');
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();
  return `#${h}${a}`;
};
