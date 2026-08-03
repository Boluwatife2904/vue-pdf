import queue from 'queue';
import { ref, watch, onBeforeUnmount } from 'vue';

import { pdf } from '../index.js';

/**
 * Vue analog of react-pdf's usePDF hook. Renders through a concurrency-1 queue
 * where a newly scheduled render replaces any pending one.
 *
 * @param {Object} [options] hook options
 * @returns {[import('vue').Ref<Object>, Function]} pdf state and update function
 */
export const usePDF = ({ document } = {}) => {
  const pdfInstance = pdf();

  const state = ref({
    url: null,
    blob: null,
    error: null,
    loading: !!document,
  });

  // Setup rendering queue
  const renderQueue = queue({ autostart: true, concurrency: 1 });

  const queueDocumentRender = () => {
    // The change event is shared across instances; skip ones without a document yet.
    if (!pdfInstance.container.document) return;

    state.value = { ...state.value, loading: true };

    renderQueue.splice(0, renderQueue.length, () =>
      state.value.error ? Promise.resolve() : pdfInstance.toBlob(),
    );
  };

  const onRenderFailed = (error) => {
    console.error(error);
    state.value = { ...state.value, loading: false, error };
  };

  const onRenderSuccessful = (blob) => {
    if (!blob) return;
    state.value = {
      blob,
      error: null,
      loading: false,
      url: URL.createObjectURL(blob),
    };
  };

  renderQueue.on('error', onRenderFailed);
  renderQueue.on('success', onRenderSuccessful);

  pdfInstance.on('change', queueDocumentRender);
  if (document) {
    pdfInstance.updateContainer(document);
  }

  // Revoke old unused url instances
  watch(
    () => state.value.url,
    (_newUrl, oldUrl) => {
      if (oldUrl) URL.revokeObjectURL(oldUrl);
    },
  );

  onBeforeUnmount(() => {
    renderQueue.end();
    pdfInstance.removeListener('change', queueDocumentRender);
    if (state.value.url) {
      URL.revokeObjectURL(state.value.url);
    }
  });

  const update = (newDoc) => {
    pdfInstance.updateContainer(newDoc);
  };

  return [state, update];
};

export default usePDF;
