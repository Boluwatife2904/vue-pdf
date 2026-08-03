<script>
import { defineComponent, h, provide, watch } from 'vue';
import { PDFSinkKey } from '@vue-pdf/reconciler';

import usePDF from './usePDF';

/**
 * Vue analog of react-pdf's BlobProvider.
 *
 * The document is provided either as a prebuilt tree via the `document` prop
 * (react-pdf API parity) or as a <Document> component in the `document` slot.
 * The default slot receives the pdf state ({ loading, blob, url, error }) —
 * the analog of react-pdf's children-as-function API.
 */
export default defineComponent({
  name: 'BlobProvider',
  props: {
    document: { type: Object, default: undefined },
  },
  setup(props, { slots }) {
    const [instance, updateInstance] = usePDF();

    provide(PDFSinkKey, {
      updateDocument: (tree) => updateInstance(tree),
    });

    watch(
      () => props.document,
      (doc) => {
        if (doc) updateInstance(doc);
      },
      { immediate: true },
    );

    if (!props.document && !slots.document) {
      console.warn('You should pass a valid document to BlobProvider');
    }

    return () => {
      const children = [];

      if (slots.default) {
        children.push(slots.default({ ...instance.value }));
      }

      if (slots.document) {
        children.push(
          h(
            'div',
            { style: 'display:none', 'aria-hidden': 'true' },
            slots.document(),
          ),
        );
      }

      return children;
    };
  },
});
</script>
