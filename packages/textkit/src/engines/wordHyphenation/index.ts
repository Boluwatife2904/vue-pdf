import * as _hyphen from 'hyphen';
const hyphen: any = (_hyphen as any).default ?? _hyphen;
import * as _pattern from 'hyphen/patterns/en-us.js';
const pattern: any = (_pattern as any).default ?? _pattern;
import { isNil } from '@vuepdf/fns';

const SOFT_HYPHEN = '\u00ad';
const hyphenator = hyphen(pattern);

/**
 * @param word
 * @returns Word parts
 */
const splitHyphen = (word: string) => {
  return word.split(SOFT_HYPHEN);
};

const cache: Record<string, string[]> = {};

/**
 * @param word
 * @returns Word parts
 */
const getParts = (word: string) => {
  const base = word.includes(SOFT_HYPHEN) ? word : hyphenator(word);
  return splitHyphen(base);
};

const wordHyphenation = () => {
  /**
   * @param word - Word
   * @returns Word parts
   */
  return (word: string | null) => {
    const cacheKey = `_${word}`;

    if (isNil(word)) return [];
    if (cache[cacheKey]) return cache[cacheKey];

    cache[cacheKey] = getParts(word);

    return cache[cacheKey];
  };
};

export default wordHyphenation;
