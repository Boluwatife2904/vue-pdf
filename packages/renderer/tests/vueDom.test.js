// @vitest-environment jsdom
import { describe, expect, it, test, vi } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';

import VuePDF, {
  usePDF,
  Font,
  StyleSheet,
  version,
  renderToBuffer,
  renderToStream,
  renderToFile,
  PDFDownloadLink,
  BlobProvider,
  PDFViewer,
  Document,
  Page,
  Text,
} from '../src/dom/index.js';

// jsdom lacks these
if (!URL.createObjectURL) {
  URL.createObjectURL = () => `blob:vue-pdf-${Math.random()}`;
  URL.revokeObjectURL = () => {};
}

const testDocumentTree = (title = 'Default') => ({
  type: 'DOCUMENT',
  props: { title },
  children: [
    {
      type: 'PAGE',
      props: {},
      children: [
        { type: 'TEXT', props: {}, children: ['Hello tests'] },
      ],
    },
  ],
});

const waitUntil = async (predicate, timeout = 10000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  throw new Error('Timed out in waitUntil');
};

describe('dom', () => {
  test('should export font store', () => {
    expect(VuePDF.Font).toBeTruthy();
    expect(Font).toBeTruthy();
  });

  test('should export styleSheet', () => {
    expect(VuePDF.StyleSheet).toBeTruthy();
    expect(StyleSheet).toBeTruthy();
  });

  test('should export version info', () => {
    expect(VuePDF.version).toBeTruthy();
    expect(version).toBeTruthy();
  });

  test('should throw error when trying to use renderToBuffer', () => {
    expect(() => renderToBuffer()).toThrow();
  });

  test('should throw error when trying to use renderToStream', () => {
    expect(() => renderToStream()).toThrow();
  });

  test('should throw error when trying to use renderToFile', () => {
    expect(() => renderToFile()).toThrow();
  });
});

describe('usePDF', () => {
  const withSetup = (composable) => {
    let result;
    const app = defineComponent({
      setup() {
        result = composable();
        return () => h('div');
      },
    });
    const wrapper = mount(app);
    return { result, wrapper };
  };

  it('returns value, updater tuple', () => {
    const { result, wrapper } = withSetup(() => usePDF({ document: undefined }));

    expect(Array.isArray(result)).toBeTruthy();
    expect(result[0].value).toMatchObject({
      url: null,
      blob: null,
      error: null,
      loading: false,
    });
    expect(typeof result[1]).toBe('function');

    wrapper.unmount();
  });

  it('works with no args', () => {
    const { result, wrapper } = withSetup(() => usePDF());

    expect(Array.isArray(result)).toBeTruthy();
    expect(typeof result[0].value).toBe('object');
    expect(typeof result[1]).toBe('function');

    wrapper.unmount();
  });

  it('renders document', async () => {
    const { result, wrapper } = withSetup(() =>
      usePDF({ document: testDocumentTree() }),
    );

    await waitUntil(() => !result[0].value.loading && result[0].value.blob);
    expect(result[0].value.blob).toBeTruthy();
    expect(result[0].value.url).toBeTruthy();
    expect(result[0].value.error).toBeNull();

    wrapper.unmount();
  });

  it('updates document', async () => {
    const { result, wrapper } = withSetup(() =>
      usePDF({ document: testDocumentTree() }),
    );

    await waitUntil(() => !result[0].value.loading && result[0].value.blob);
    const pdfSize = result[0].value.blob.size;

    result[1](testDocumentTree('Long long long title'));

    await waitUntil(
      () =>
        !result[0].value.loading &&
        result[0].value.blob &&
        result[0].value.blob.size !== pdfSize,
    );

    expect(result[0].value.blob.size).not.toEqual(pdfSize);

    wrapper.unmount();
  });
});

describe('PDFDownloadLink', () => {
  it('renders an anchor with a download filename and provides state to its slot', async () => {
    const wrapper = mount(PDFDownloadLink, {
      props: { document: testDocumentTree(), fileName: 'test.pdf' },
      slots: {
        default: ({ loading }) => (loading ? 'Loading document...' : 'Download now!'),
      },
    });

    const anchor = wrapper.find('a');
    expect(anchor.exists()).toBeTruthy();
    expect(anchor.attributes('download')).toBe('test.pdf');

    await waitUntil(() => wrapper.text().includes('Download now!'));
    expect(wrapper.find('a').attributes('href')).toBeTruthy();

    wrapper.unmount();
  });

  it('warns when no document is given', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const wrapper = mount(PDFDownloadLink);

    expect(warn).toHaveBeenCalledWith(
      'You should pass a valid document to PDFDownloadLink',
    );

    warn.mockRestore();
    wrapper.unmount();
  });

  it('renders a slotted <Document> through the sink', async () => {
    const wrapper = mount(PDFDownloadLink, {
      props: { fileName: 'slotted.pdf' },
      slots: {
        default: ({ loading }) => (loading ? 'Loading...' : 'Ready'),
        document: () =>
          h(Document, { title: 'Slotted' }, () =>
            h(Page, null, () => h(Text, null, () => 'Slot content')),
          ),
      },
    });

    await waitUntil(() => wrapper.find('a').attributes('href'));
    expect(wrapper.find('a').attributes('href')).toBeTruthy();
    expect(wrapper.text()).toContain('Ready');

    wrapper.unmount();
  });
});

describe('BlobProvider', () => {
  it('provides blob and url to its slot', async () => {
    let received = null;

    const wrapper = mount(BlobProvider, {
      props: { document: testDocumentTree() },
      slots: {
        default: (state) => {
          received = state;
          return h('span', state.loading ? 'loading' : 'done');
        },
      },
    });

    await waitUntil(() => received && !received.loading && received.blob);
    expect(received.blob).toBeTruthy();
    expect(received.url).toBeTruthy();
    expect(received.error).toBeNull();

    wrapper.unmount();
  });
});

describe('PDFViewer', () => {
  it('renders an iframe pointing at the generated blob url', async () => {
    const wrapper = mount(PDFViewer, {
      props: { document: testDocumentTree(), title: 'Viewer' },
    });

    expect(wrapper.find('iframe').exists()).toBeTruthy();

    await waitUntil(() => {
      const src = wrapper.find('iframe').attributes('src');
      return src && src.includes('#toolbar=1');
    });

    await nextTick();
    expect(wrapper.find('iframe').attributes('title')).toBe('Viewer');

    wrapper.unmount();
  });
});
