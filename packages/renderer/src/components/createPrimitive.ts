import { defineComponent, h, inject, onUnmounted, onUpdated } from 'vue';
import { DocumentContextKey, NODE_ID_ATTRIBUTE } from '@vue-pdf/reconciler';
import { tw } from '@vue-pdf/tailwind';

const camelizeRE = /-(\w)/g;

const camelize = (str: string): string =>
  str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''));

/** Bare template attributes (`<Text fixed>`) arrive as '' — cast them to true, as JSX does. */
const BOOLEAN_PROPS = new Set([
  'wrap',
  'break',
  'fixed',
  'debug',
  'cache',
  'inline',
  'checked',
  'disabled',
  'readOnly',
  'required',
  'multiline',
  'password',
  'noExport',
  'noSpell',
  'xMark',
  'sort',
  'edit',
  'multiSelect',
  'transparent',
]);

/** Splits vnode attrs into react-pdf shaped { props, style }, camelizing kebab-case keys. */
export const normalizeAttrs = (
  attrs: Record<string, unknown>,
): { props: Record<string, unknown>; style: unknown } => {
  const props: Record<string, unknown> = {};
  let userStyle: unknown = undefined;
  let twStyle: unknown = undefined;

  for (const key of Object.keys(attrs)) {
    const name = key.includes('-') ? camelize(key) : key;

    if (name === 'style') {
      userStyle = attrs[key] ?? {};
    } else if (name === 'tw') {
      if (attrs[key]) {
        twStyle = tw(String(attrs[key]));
      }
    } else if (attrs[key] === '' && BOOLEAN_PROPS.has(name)) {
      props[name] = true;
    } else {
      props[name] = attrs[key];
    }
  }

  const style =
    twStyle == null
      ? (userStyle ?? {})
      : [twStyle, ...(Array.isArray(userStyle) ? userStyle : userStyle == null ? [] : [userStyle])];

  return { props, style };
};

/**
 * One component per primitive. Renders an inert placeholder so ordering and text
 * can be recovered from the DOM, and registers itself with the owning <Document>.
 */
export const createPrimitive = (name: string, type: string) =>
  defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      const ctx = inject(DocumentContextKey, null);
      let id = '';

      if (ctx) {
        id = ctx.allocateId();
        ctx.register(id, type);

        onUpdated(() => ctx.invalidate());
        onUnmounted(() => {
          ctx.unregister(id);
          ctx.invalidate();
        });
      } else {
        console.warn(
          `<${name}> component must be rendered inside a <Document> component`,
        );
      }

      return () => {
        if (ctx) {
          // attrs is not deeply reactive; re-read each render to keep the registry in sync.
          const { props, style } = normalizeAttrs(attrs);
          ctx.setNodeData(id, props, style);
        }

        return h(
          'div',
          { [NODE_ID_ATTRIBUTE]: id },
          slots.default ? slots.default() : undefined,
        );
      };
    },
  });

export default createPrimitive;
