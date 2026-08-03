// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import zlib from 'zlib';

import { Document, Page, View, Text } from '../src/components/index.js';

const waitFor = async (getter, timeout = 10000) => {
  const start = Date.now();
  /* eslint-disable no-await-in-loop */
  while (Date.now() - start < timeout) {
    const value = getter();
    if (value) return value;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  /* eslint-enable no-await-in-loop */
  throw new Error('Timed out waiting for PDF render');
};

const extractPdfText = async (blob) => {
  const buffer = Buffer.from(await blob.arrayBuffer());

  // Collect text from every content stream (FlateDecode-compressed or raw)
  let text = '';
  let searchIndex = 0;

  for (;;) {
    const start = buffer.indexOf('stream', searchIndex);
    if (start === -1) break;

    const dataStart = buffer.indexOf('\n', start) + 1;
    const end = buffer.indexOf('endstream', dataStart);
    if (end === -1) break;

    const raw = buffer.subarray(dataStart, end);
    try {
      text += zlib.inflateSync(raw).toString('latin1');
    } catch {
      text += raw.toString('latin1');
    }

    searchIndex = end + 'endstream'.length;
  }

  return text;
};

describe('Vue component tree to PDF pipeline', () => {
  it('renders a non-blank PDF from mounted Vue components', async () => {
    let rendered = null;

    const app = {
      render() {
        return h(
          Document,
          { onRender: (params) => (rendered = params) },
          () =>
            h(Page, { size: 'A4' }, () =>
              h(View, { style: { margin: 30, padding: 20 } }, () => [
                h(Text, { style: { fontSize: 24 } }, () => 'Hello from Vue PDF!'),
                h(Text, { style: { fontSize: 12 } }, () => 'Second paragraph'),
              ]),
            ),
        );
      },
    };

    const wrapper = mount(app, { attachTo: document.body });

    const result = await waitFor(() => rendered);

    expect(result.blob).toBeInstanceOf(Blob);
    expect(result.blob.size).toBeGreaterThan(500);
    expect(result._INTERNAL__LAYOUT__DATA_).toBeTruthy();

    // Page must contain actual laid-out content, not just an empty page
    const pageNode = result._INTERNAL__LAYOUT__DATA_.children[0];
    expect(pageNode.children.length).toBeGreaterThan(0);

    const contents = await extractPdfText(result.blob);

    // pdfkit encodes text as hex glyph strings; presence of text-showing
    // operators plus glyph data means the page is not blank
    expect(contents).toMatch(/Tj|TJ/);

    wrapper.unmount();
  });

  it('builds the internal instance tree in react-pdf format', async () => {
    let rendered = null;

    const app = {
      render() {
        return h(
          Document,
          { title: 'Test doc', onRender: (params) => (rendered = params) },
          () =>
            h(Page, { size: 'A4' }, () =>
              h(Text, null, () => 'Sample text'),
            ),
        );
      },
    };

    const wrapper = mount(app, { attachTo: document.body });
    await nextTick();

    const layout = (await waitFor(() => rendered))._INTERNAL__LAYOUT__DATA_;

    expect(layout.type).toBe('DOCUMENT');
    expect(layout.props.title).toBe('Test doc');

    const page = layout.children[0];
    expect(page.type).toBe('PAGE');

    wrapper.unmount();
  });
});
