import propsEqual from './propsEqual';

/** Tokenizes functions so comparison tests whether a callback exists, not its identity. */
const comparable = (value: any): any => {
  if (typeof value === 'function') return '[[function]]';

  if (Array.isArray(value)) return value.map(comparable);

  if (value && typeof value === 'object') {
    const result: Record<string, any> = {};
    for (const key of Object.keys(value)) {
      result[key] = comparable(value[key]);
    }
    return result;
  }

  return value;
};

/** Deep-compares instance trees so <Document> can skip re-commits and avoid render loops. */
const treesEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (!a || !b) return false;

  if (a.type !== b.type) return false;

  if (a.type === 'TEXT_INSTANCE') return a.value === b.value;

  if (!propsEqual(comparable(a.props || {}), comparable(b.props || {}))) {
    return false;
  }

  if (!propsEqual(comparable(a.style || {}), comparable(b.style || {}))) {
    return false;
  }

  const aChildren = a.children || [];
  const bChildren = b.children || [];

  if (aChildren.length !== bChildren.length) return false;

  for (let i = 0; i < aChildren.length; i += 1) {
    if (!treesEqual(aChildren[i], bChildren[i])) return false;
  }

  return true;
};

export default treesEqual;
