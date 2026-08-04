<script>
import { defineComponent, h, provide, watch, Fragment } from 'vue';
import { PDFSinkKey } from '@vuepdf/reconciler';

import usePDF from './usePDF';

/** Vue analog of react-pdf's PDFViewer. Takes a `document` tree or a slotted <Document>. */
export default defineComponent({
  name: 'PDFViewer',
  inheritAttrs: false,
  props: {
    title: { type: String, default: undefined },
    style: { type: [Object, Array, String], default: undefined },
    className: { type: String, default: undefined },
    showToolbar: { type: Boolean, default: true },
    document: { type: Object, default: undefined },
  },
  emits: ['render'],
  setup(props, { attrs, slots, emit, expose }) {
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

    // Lets consumers wire up e.g. a download button without owning a pdf() instance.
    watch(
      () => instance.value.url,
      (url) => {
        if (url) emit('render', { url, blob: instance.value.blob });
      },
    );

    /** Programmatically download the currently rendered document. */
    const download = (filename = 'document.pdf') => {
      const { blob, url } = instance.value;
      const href = url || (blob ? URL.createObjectURL(blob) : null);
      if (!href) return;
      const a = window.document.createElement('a');
      a.href = href;
      a.download = filename;
      window.document.body.appendChild(a);
      a.click();
      a.remove();
    };

    expose({
      download,
      /** Latest render state: { url, blob, error, loading } */
      getState: () => instance.value,
    });

    return () => {
      const url = instance.value.url;
      const src = url ? `${url}#toolbar=${props.showToolbar ? 1 : 0}` : undefined;

      const children = [
        h('iframe', {
          src,
          title: props.title,
          style: props.style,
          class: props.className,
          ...attrs,
        }),
      ];

      if (slots.default) {
        children.push(
          h(
            'div',
            { style: 'display:none', 'aria-hidden': 'true' },
            slots.default(),
          ),
        );
      }

      // A Fragment, not a bare array: an array trips Nuxt's client-only wrapper.
      return h(Fragment, null, children);
    };
  },
});
</script>
