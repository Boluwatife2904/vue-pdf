import { Fragment } from '../src/utils';

export { Fragment };

/**
 * JSX factory for the ported react-pdf test suites. Produces the same
 * element shape react's createElement does for host/string components:
 * `{ type, props: { ...props, children } }` — which `ensureInstanceTree`
 * lifts into the internal instance format.
 */
export const e = (type, props, ...children) => ({
  type,
  props: {
    ...(props || {}),
    ...(children.length
      ? { children: children.length === 1 ? children[0] : children }
      : {}),
  },
});
