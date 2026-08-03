import type { InjectionKey } from 'vue';

export { default as propsEqual } from './propsEqual';
export { default as treesEqual } from './treesEqual';

/**
 * Vue analog of `@react-pdf/reconciler`. Vue has no swappable reconciler, so
 * primitives register their type/props/style here and render tagged DOM nodes;
 * `buildTree` walks that subtree to recover ordering and text, assembling the
 * same internal instance format react-pdf uses.
 */

export interface HostConfig {
  createInstance: (type: string, propsWithStyle: Record<string, any>) => any;
  createTextInstance: (text: string) => any;
  appendChild: (parent: any, child: any) => void;
  appendChildToContainer: (container: any, child: any) => void;
  insertBefore: (parent: any, child: any, beforeChild: any) => void;
  removeChild: (parent: any, child: any) => void;
  removeChildFromContainer: (container: any, child: any) => void;
  commitTextUpdate: (textInstance: any, oldText: string, newText: string) => void;
  commitUpdate: (
    instance: any,
    updatePayload: any,
    type: string,
    oldProps: Record<string, any>,
    newProps: Record<string, any>,
  ) => void;
  resetAfterCommit?: () => void;
}

export interface NodeData {
  type: string;
  props: Record<string, any>;
  style: any;
}

export interface DocumentContext {
  allocateId: () => string;
  register: (id: string, type: string) => void;
  setNodeData: (id: string, props: Record<string, any>, style: any) => void;
  unregister: (id: string) => void;
  /** Notify the owning <Document> that PDF content changed */
  invalidate: () => void;
  /** Assemble the internal instance tree from the mounted DOM subtree */
  buildTree: (
    rootElement: Element,
    documentProps: Record<string, any>,
    documentStyle: any,
  ) => any;
  /** Assemble the internal instance tree from Vue SSR HTML output */
  buildTreeFromHtml: (
    html: string,
    documentProps: Record<string, any>,
    documentStyle: any,
  ) => any;
}

export interface PDFSink {
  updateDocument: (documentInstance: any) => void;
  registerDocumentContext?: (
    context: DocumentContext,
    documentProps: Record<string, any>,
    documentStyle: any,
  ) => void;
}

export const DocumentContextKey: InjectionKey<DocumentContext> =
  Symbol('vue-pdf-document-context');

export const PDFSinkKey: InjectionKey<PDFSink> = Symbol('vue-pdf-sink');

export const NODE_ID_ATTRIBUTE = 'data-vue-pdf-node';

/** Node types whose children may be raw text (mirrors renderer host config) */
const TEXT_PARENTS = ['TEXT', 'LINK', 'TSPAN', 'NOTE'];

const Reconciler = (hostConfig: HostConfig) => {
  const createDocumentContext = ({
    onInvalidate,
  }: {
    onInvalidate: () => void;
  }): DocumentContext => {
    const registry = new Map<string, NodeData>();

    // Per-context, not module-global: `registry` is per-document, and a shared
    // counter made server and client ids diverge, blanking the PDF after hydration.
    let instanceCounter = 0;

    let scheduled = false;

    const invalidate = () => {
      // Batch invalidations from many components into a single notification.
      if (scheduled) return;
      scheduled = true;
      queueMicrotask(() => {
        scheduled = false;
        onInvalidate();
      });
    };

    const buildNodeChildren = (domElement: Element, parentInstance: any) => {
      const childNodes = domElement.childNodes;

      for (let i = 0; i < childNodes.length; i += 1) {
        const node = childNodes[i];

        // Becomes a TEXT_INSTANCE; appendChild applies the orphan-text guard.
        if (node.nodeType === 3) {
          const value = node.nodeValue;
          if (!value) continue;

          const isParentText = TEXT_PARENTS.includes(parentInstance.type);
          if (!isParentText && !value.trim()) continue; // template whitespace

          const textInstance = hostConfig.createTextInstance(value);
          hostConfig.appendChild(parentInstance, textInstance);
          continue;
        }

        if (node.nodeType !== 1) continue; // skip comments (v-if anchors)

        const element = node as Element;
        const id = element.getAttribute(NODE_ID_ATTRIBUTE);
        const data = id ? registry.get(id) : undefined;

        if (!data) {
          // Rendered by a non-primitive component; treat it as transparent.
          buildNodeChildren(element, parentInstance);
          continue;
        }

        const instance = hostConfig.createInstance(data.type, {
          ...data.props,
          style: data.style,
        });

        hostConfig.appendChild(parentInstance, instance);
        buildNodeChildren(element, instance);
      }
    };

    const appendText = (parentInstance: any, value: string) => {
      if (!value) return;

      const isParentText = TEXT_PARENTS.includes(parentInstance.type);
      if (!isParentText && !value.trim()) return; // template whitespace

      const textInstance = hostConfig.createTextInstance(decodeHtml(value));
      hostConfig.appendChild(parentInstance, textInstance);
    };

    const buildTreeFromHtml = (
      html: string,
      documentProps: Record<string, any>,
      documentStyle: any,
    ) => {
      const documentInstance = hostConfig.createInstance('DOCUMENT', {
        ...documentProps,
        style: documentStyle,
      });

      const stack: any[] = [documentInstance];
      const tokenPattern =
        /<\/?[^>]+>|[^<]+/g;

      for (const token of html.match(tokenPattern) || []) {
        const parent = stack[stack.length - 1];

        if (token.startsWith('</')) {
          if (stack.length > 1) stack.pop();
          continue;
        }

        if (token.startsWith('<')) {
          if (token.startsWith('<!--') || token.startsWith('<!')) continue;

          const idMatch = token.match(
            new RegExp(`${NODE_ID_ATTRIBUTE}=["']([^"']+)["']`),
          );
          const data = idMatch ? registry.get(idMatch[1]) : undefined;

          if (!data) {
            stack.push(parent);
            continue;
          }

          const instance = hostConfig.createInstance(data.type, {
            ...data.props,
            style: data.style,
          });

          hostConfig.appendChild(parent, instance);
          stack.push(instance);
          continue;
        }

        appendText(parent, token);
      }

      return documentInstance;
    };

    const ctx: DocumentContext = {
      allocateId: () => {
        instanceCounter += 1;
        return `vue-pdf-${instanceCounter}`;
      },

      register: (id, type) => {
        registry.set(id, { type, props: {}, style: {} });
      },

      setNodeData: (id, props, style) => {
        const entry = registry.get(id);
        if (!entry) return;
        entry.props = props;
        entry.style = style;
      },

      unregister: (id) => {
        registry.delete(id);
      },

      invalidate,

      buildTree: (rootElement, documentProps, documentStyle) => {
        const documentInstance = hostConfig.createInstance('DOCUMENT', {
          ...documentProps,
          style: documentStyle,
        });

        buildNodeChildren(rootElement, documentInstance);

        return documentInstance;
      },

      buildTreeFromHtml,
    };

    return ctx;
  };

  return { createDocumentContext };
};

export default Reconciler;

const htmlEntities: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: '\u00a0',
};

const decodeHtml = (value: string) =>
  value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (_match, entity) => {
    if (entity[0] === '#') {
      const radix = entity[1]?.toLowerCase() === 'x' ? 16 : 10;
      const start = radix === 16 ? 2 : 1;
      const codePoint = Number.parseInt(entity.slice(start), radix);
      return Number.isNaN(codePoint) ? _match : String.fromCodePoint(codePoint);
    }

    return htmlEntities[entity] ?? _match;
  });
