export const omitNils = (object) =>
  Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined),
  );

/** Groups children without a wrapper node — the analog of react-pdf's `<>...</>`. */
export const Fragment = Symbol.for('vue-pdf.fragment');

const isTextParent = (type) =>
  type === 'TEXT' || type === 'LINK' || type === 'TSPAN' || type === 'NOTE';

/** Normalizes a hand-built element tree into react-pdf's internal instance format. */
export const ensureInstanceTree = (node) => {
  if (typeof node.type === 'function') {
    return ensureInstanceTree(node.type(node.props || {}));
  }

  const { style: propsStyle, children: propsChildren, ...restProps } =
    node.props || {};

  const style = node.style ?? propsStyle ?? {};
  const children = node.children ?? propsChildren ?? [];

  const instance = {
    type: node.type,
    box: node.box || {},
    style,
    props: restProps,
    children: [],
  };

  appendChildren(instance, children);

  return instance;
};

const appendChildren = (parent, children) => {
  const list = Array.isArray(children) ? children : [children];

  for (const child of list) {
    // Conditional-rendering artifacts, like react ignores
    if (child === null || child === undefined || typeof child === 'boolean') {
      continue;
    }

    if (Array.isArray(child)) {
      appendChildren(parent, child);
      continue;
    }

    if (typeof child === 'string' || typeof child === 'number') {
      appendTextInstance(parent, String(child));
      continue;
    }

    if (child.type === Fragment) {
      appendChildren(parent, child.children ?? child.props?.children ?? []);
      continue;
    }

    if (child.type === 'TEXT_INSTANCE') {
      appendTextInstance(parent, child.value != null ? String(child.value) : '');
      continue;
    }

    parent.children.push(ensureInstanceTree(child));
  }
};

const appendTextInstance = (parent, value) => {
  // Matches the host config: text outside a text-capable parent is dropped, not rendered.
  if (!isTextParent(parent.type)) {
    console.warn(`Invalid '${value}' string child outside <Text> component`);
    return;
  }

  parent.children.push({ type: 'TEXT_INSTANCE', value });
};
