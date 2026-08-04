import type { Style } from '@vuepdf/stylesheet';
import type { TwTheme, TwOptions } from './types';
import { defaultTheme } from './theme/defaultTheme';
import { colors } from './theme/colors';
import { exactUtilities } from './maps/exact';
import { patternUtils } from './maps/patterns';
import {
  deepMerge,
  merge,
  splitPrefix,
  isNegative,
  stripNegative,
  applyNegative,
} from './utils';

const RESPONSIVE_RE = /^(sm|md|lg|xl|2xl):/;

export const createTw = (
  userTheme?: TwTheme,
  options?: TwOptions,
): ((classes: string) => Style) => {
  const ptPerRem = options?.ptPerRem ?? 12;

  let theme: any = { ...defaultTheme };
  let mergedColors: any = { ...colors };

  if (userTheme) {
    if (userTheme.extend) {
      const { extend: _extend, ...rest } = userTheme;
      theme = deepMerge(theme, rest);
      theme = deepMerge(theme, _extend);
    } else {
      theme = deepMerge(theme, userTheme);
    }
    if (userTheme.colors) {
      mergedColors = deepMerge(mergedColors, userTheme.colors);
    }
  }

  const patternKeys = Object.keys(patternUtils);

  const cache = new Map<string, Style>();

  const parse = (className: string): any => {
    const responsive = className.match(RESPONSIVE_RE);
    if (responsive) {
      const breakpoint = responsive[1];
      const inner = className.slice(breakpoint.length + 1);
      const innerStyle = parse(inner);
      if (Object.keys(innerStyle).length === 0) return {};
      const queryKey = `@media (min-width: ${getBreakpointPt(breakpoint)}pt)` as keyof Style;
      return { [queryKey]: innerStyle as any };
    }

    const isNeg = isNegative(className);
    const stripped = isNeg ? stripNegative(className) : className;

    const exact = exactUtilities[stripped];
    if (exact) {
      return isNeg ? applyNegative({ ...exact }, true) : { ...exact };
    }

    const prefixMatch = splitPrefix(stripped, patternKeys);
    if (prefixMatch) {
      const { prefix, rest } = prefixMatch;
      const fn = patternUtils[prefix];
      if (fn) {
        const value = rest || 'DEFAULT';
        const opts = { ptPerRem, theme, colors: mergedColors };
        let result = fn(value, opts);
        if (result === null) return handleInvalid(className);
        if (isNeg) result = applyNegative(result as any, true);
        return result;
      }
    }

    return handleInvalid(className);
  };

  const handleInvalid = (className: string): any => {
    console.warn(`[vue-pdf-tailwind] Unknown class "${className}" - skipping.`);
    return {};
  };

  return (input: string): Style => {
    if (!input || typeof input !== 'string') return {} as Style;

    const cached = cache.get(input);
    if (cached) return { ...cached };

    const classNames = input.split(/\s+/).filter(Boolean);
    const styles = classNames.map(parse);
    const result = merge(...styles) as Style;

    cache.set(input, { ...result });
    return result;
  };
};

function getBreakpointPt(bp: string): string {
  const breakpoints: Record<string, string> = {
    sm: '480',
    md: '576',
    lg: '768',
    xl: '960',
    '2xl': '1152',
  };
  return breakpoints[bp] ?? '768';
}

export const tw = createTw();

export let activeTw = tw;

export const configureTw = (userTheme?: TwTheme, options?: TwOptions): void => {
  activeTw = createTw(userTheme, options);
};
