<script>
import { defineComponent, h, provide, watch } from 'vue';
import { PDFSinkKey } from '@vuepdf/reconciler';

import usePDF from './usePDF';

/**
 * Vue analog of react-pdf's PDFDownloadLink.
 *
 * The document is provided either as a prebuilt tree via the `document` prop
 * (react-pdf API parity) or as a <Document> component in the `document` slot.
 * The default slot renders the link label and receives the pdf state
 * ({ loading, blob, url, error }) — the analog of react-pdf's
 * children-as-function API.
 */
export default defineComponent({
  name: 'PDFDownloadLink',
  inheritAttrs: false,
  props: {
    document: { type: Object, default: undefined },
    fileName: { type: String, default: 'document.pdf' },
  },
  emits: ['click'],
  setup(props, { attrs, slots, emit }) {
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
      console.warn('You should pass a valid document to PDFDownloadLink');
    }

    const handleDownloadIE = () => {
      if (instance.value.blob && window.navigator.msSaveBlob) {
        // IE
        window.navigator.msSaveBlob(instance.value.blob, props.fileName);
      }
    };

    const handleClick = (event) => {
      handleDownloadIE();
      emit('click', event, instance.value);
    };

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

      return h(
        'a',
        {
          href: instance.value.url,
          download: props.fileName,
          onClick: handleClick,
          ...attrs,
        },
        children,
      );
    };
  },
});
</script>
