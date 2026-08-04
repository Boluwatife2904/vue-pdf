import { castArray } from '@vuepdf/fns';
import * as P from '@vuepdf/primitives';

import { Node } from '../types';

const isString = (value: any): value is string => typeof value === 'string';

const isNumber = (value: any): value is number => typeof value === 'number';

const isBoolean = (value: any): value is boolean => typeof value === 'boolean';

/**
 * Transforms a vue-pdf element instance to internal element format.
 *
 * Can return multiple instances in the case of arrays.
 *
 * @param element - vue-pdf element tree node
 * @returns Parsed elements
 */
const createInstances = (element: any): Node[] => {
  if (!element) return [];

  if (Array.isArray(element)) {
    return element.reduce((acc, el) => acc.concat(createInstances(el)), []);
  }

  if (isBoolean(element)) {
    return [];
  }

  if (isString(element) || isNumber(element)) {
    return [{ type: P.TextInstance, value: `${element}` }];
  }

  if (!element.type || !isString(element.type)) {
    return [];
  }

  const {
    type,
    style = {},
    props = {},
    children: rawChildren,
  } = element;

  const children = rawChildren || [];

  const nextChildren = castArray(children).reduce(
    (acc: any[], child: any) => acc.concat(createInstances(child)),
    [],
  );

  return [
    {
      type,
      style,
      props,
      children: nextChildren,
    },
  ] as Node[];
};

export default createInstances;
