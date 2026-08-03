import { describe, expect, test, vi } from 'vitest';

import fs from 'fs';
import path from 'path';
import url from 'url';
import { defineComponent, h } from 'vue';
import ReactPDF from '../src/node';
import {
  Document as VueDocument,
  Page as VuePage,
  Text as VueText,
} from '../src/components';

const { Document, Page, View } = ReactPDF;

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/**
 * @param {Object} props
 */
const TestDocument = ({ onRender }) => {
  return (
    <Document onRender={onRender}>
      <Page>
        <View style={{ width: 20, height: 20, backgroundColor: 'red' }} />
      </Page>
    </Document>
  );
};

describe('node', () => {
  test('should render to buffer', async () => {
    const document = await ReactPDF.renderToBuffer(<TestDocument />);

    expect(Buffer.isBuffer(document)).toBe(true);
    expect(document.indexOf('%PDF-1.3')).toBe(0);
  });

  test('should render a Vue component to buffer', async () => {
    const VueTestDocument = defineComponent({
      props: {
        title: {
          type: String,
          required: true,
        },
      },
      setup(props) {
        return () =>
          h(VueDocument, { title: props.title }, () =>
            h(VuePage, { size: 'A4' }, () =>
              h(VueText, null, () => props.title),
            ),
          );
      },
    });

    const document = await ReactPDF.renderToBuffer(VueTestDocument, {
      title: 'Server rendered Vue document',
    });

    expect(Buffer.isBuffer(document)).toBe(true);
    expect(document.indexOf('%PDF-1.3')).toBe(0);
  });

  test('should render to buffer call render callback', async () => {
    const mock = vi.fn();

    await ReactPDF.renderToBuffer(<TestDocument onRender={mock} />);

    expect(mock.mock.calls).toHaveLength(1);
  });

  test('should render to stream', async () => {
    const document = await ReactPDF.renderToStream(<TestDocument />);

    expect(typeof document).toBe('object');
    expect(typeof document.pipe).toBe('function');
  });

  test('should render to stream call render callback', async () => {
    const mock = vi.fn();

    await ReactPDF.renderToStream(<TestDocument onRender={mock} />);

    expect(mock.mock.calls).toHaveLength(1);
  });

  test('should render to file', async () => {
    const pdfPath = `${__dirname}/test.pdf`;
    await ReactPDF.renderToFile(<TestDocument />, pdfPath);

    expect(fs.existsSync(pdfPath)).toBeTruthy();

    fs.unlinkSync(pdfPath);
  });

  test('should export font store', () => {
    expect(ReactPDF.Font).toBeTruthy();
  });

  test('should export styleSheet', () => {
    expect(ReactPDF.StyleSheet).toBeTruthy();
  });

  test('should export version info', () => {
    expect(ReactPDF.version).toBeTruthy();
  });

  test('should throw error when trying to use PDFViewer', () => {
    expect(() => ReactPDF.PDFViewer()).toThrow();
  });

  test('should throw error when trying to use PDFDownloadLink', () => {
    expect(() => ReactPDF.PDFDownloadLink()).toThrow();
  });

  test('should throw error when trying to use BlobProvider', () => {
    expect(() => ReactPDF.BlobProvider()).toThrow();
  });

  test('should throw error when trying to use usePDF', () => {
    expect(() => ReactPDF.usePDF()).toThrow();
  });

  test('should render a fragment', async () => {
    const mock = vi.fn();

    const doc = (
      <Document onRender={mock}>
        <Page>
          <View>
            <>
              <View style={{ width: 20, height: 20, backgroundColor: 'red' }} />
              <View style={{ width: 20, height: 20, backgroundColor: 'red' }} />
            </>
          </View>
        </Page>
      </Document>
    );

    await ReactPDF.renderToBuffer(doc);

    expect(mock.mock.calls).toHaveLength(1);
  });

  test('should render a fragment in render', async () => {
    const renderMock = vi.fn().mockReturnValue(
      <>
        <View style={{ width: 20, height: 20, backgroundColor: 'red' }} />
        <View style={{ width: 20, height: 20, backgroundColor: 'red' }} />
      </>,
    );

    const doc = (
      <Document>
        <Page>
          <View render={renderMock} />
        </Page>
      </Document>
    );

    await ReactPDF.renderToBuffer(doc);

    expect(renderMock.mock.calls).toHaveLength(2);
  });

  test('should render a child array', async () => {
    const mock = vi.fn();

    const children = [
      <View
        key="child1"
        style={{ width: 20, height: 20, backgroundColor: 'red' }}
      />,
      <View
        key="child2"
        style={{ width: 20, height: 20, backgroundColor: 'red' }}
      />,
    ];

    const doc = (
      <Document onRender={mock}>
        <Page>
          <View>{children}</View>
        </Page>
      </Document>
    );

    await ReactPDF.renderToBuffer(doc);

    expect(mock.mock.calls).toHaveLength(1);
  });

  test('should render a child array in render', async () => {
    const children = [
      <View style={{ width: 20, height: 20, backgroundColor: 'red' }} />,
      <View style={{ width: 20, height: 20, backgroundColor: 'red' }} />,
    ];

    const renderMock = vi.fn().mockReturnValue(children);

    const doc = (
      <Document>
        <Page>
          <View render={renderMock} />
        </Page>
      </Document>
    );

    await ReactPDF.renderToBuffer(doc);

    expect(renderMock.mock.calls).toHaveLength(2);
  });

  test('should render nested dynamic views', async () => {
    const renderNode = (
      <View
        key="child1"
        style={{ width: 20, height: 20, backgroundColor: 'red' }}
      />
    );

    const renderMock = vi.fn().mockReturnValue(renderNode);

    const doc = (
      <Document>
        <Page>
          <View render={renderMock} />
          <View
            render={() => {
              return <View render={renderMock} />;
            }}
          />
          <View
            render={() => {
              return (
                <View
                  render={() => {
                    return <View render={renderMock} />;
                  }}
                />
              );
            }}
          />
        </Page>
      </Document>
    );

    await ReactPDF.renderToBuffer(doc);

    expect(renderMock.mock.calls).toHaveLength(6);
  });
});
