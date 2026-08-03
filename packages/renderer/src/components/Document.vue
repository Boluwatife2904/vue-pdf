<script lang="ts">
import {
  defineComponent,
  h,
  provide,
  inject,
  ref,
  onMounted,
  onUpdated,
  onBeforeUnmount,
} from 'vue';
import queue from 'queue';
import {
  DocumentContextKey,
  PDFSinkKey,
  treesEqual,
} from '@vue-pdf/reconciler';

import { pdf, createRenderer } from '../index';
import { normalizeAttrs } from './createPrimitive';

/**
 * Vue analog of react-pdf's Document primitive: provides the reconciler context,
 * assembles the instance tree from the mounted components, and commits it either
 * to an enclosing viewer's pdf instance (the "sink") or to its own.
 */
export default defineComponent({
  name: 'Document',
  inheritAttrs: false,
  setup(_, { attrs, slots, expose }) {
    const rootRef = ref<Element | null>(null);
    const sink = inject(PDFSinkKey, null);

    let unmounted = false;

    // Assembles instances through the host config so tree shape matches react-pdf.
    const vueRenderer = createRenderer({ onChange: () => {} });
    const ctx = vueRenderer.createDocumentContext({
      onInvalidate: () => flush(),
    });

    provide(DocumentContextKey, ctx);

    // Standalone mode: own pdf instance, with usePDF's render-queue semantics.
    let pdfInstance: ReturnType<typeof pdf> | null = null;
    let renderQueue: any = null;

    const queueDocumentRender = () => {
      if (!pdfInstance || !pdfInstance.container.document) return;
      renderQueue.splice(0, renderQueue.length, () => pdfInstance!.toBlob());
    };

    const ensureStandaloneInstance = () => {
      if (pdfInstance) return;
      pdfInstance = pdf();
      renderQueue = queue({ autostart: true, concurrency: 1 });
      renderQueue.on('error', (error: Error) => console.error(error));
      pdfInstance.on('change', queueDocumentRender);
    };

    let committedTree: any = null;

    const flush = () => {
      if (unmounted || !rootRef.value) return;

      const { props, style } = normalizeAttrs(attrs);
      const tree = ctx.buildTree(rootRef.value, props, style);

      // An identical tree would loop render → change → render forever; bail out.
      if (committedTree && treesEqual(committedTree, tree)) return;

      committedTree = tree;

      if (sink) {
        sink.updateDocument(tree);
      } else {
        ensureStandaloneInstance();
        pdfInstance!.updateContainer(tree);
      }
    };

    onMounted(flush);
    onUpdated(() => ctx.invalidate());
    onBeforeUnmount(() => {
      unmounted = true;
      if (pdfInstance) {
        pdfInstance.removeListener('change', queueDocumentRender);
        renderQueue.end();
      }
    });

    expose({
      /** Re-assemble and commit the document tree */
      updateDocument: () => flush(),
      /** Standalone-mode pdf instance (null when inside a viewer/provider) */
      getPdfInstance: () => pdfInstance,
    });

    return () =>
      {
        if (sink && 'registerDocumentContext' in sink) {
          const { props, style } = normalizeAttrs(attrs);
          sink.registerDocumentContext(ctx, props, style);
        }

        return h(
          'div',
          { ref: rootRef, style: 'display:none', 'aria-hidden': 'true' },
          slots.default ? slots.default() : undefined,
        );
      };
  },
});
</script>
