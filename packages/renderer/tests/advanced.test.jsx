import { describe, test, expect } from 'vitest';
import { h } from 'vue';
import zlib from 'node:zlib';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import {
  Document,
  Page,
  View,
  Text,
  Link,
  StyleSheet,
  renderToBuffer,
} from '@vuepdf/renderer';

const doc = async (el) => {
  const buffer = await renderToBuffer(el);
  return getDocument({ data: new Uint8Array(buffer), verbosity: 0 }).promise;
};

describe('advanced features', () => {
  test('bookmarks produce a nested outline', async () => {
    const d = await doc(
      <Document>
        <Page size="A4" bookmark="Part One">
          <Text bookmark={{ title: 'Chapter 1', fit: true }}>one</Text>
          <Text bookmark={{ title: 'Chapter 2', expanded: true, zoom: 2 }} break>
            two
          </Text>
        </Page>
      </Document>,
    );

    const outline = await d.getOutline();

    expect(outline).toHaveLength(1);
    expect(outline[0].title).toBe('Part One');
    expect(outline[0].items.map((item) => item.title)).toEqual([
      'Chapter 1',
      'Chapter 2',
    ]);
  }, 20000);

  test('named destinations resolve', async () => {
    const d = await doc(
      <Document>
        <Page size="A4">
          <Link href="#foot">go</Link>
          <View id="foot" break>
            <Text>dest</Text>
          </View>
        </Page>
      </Document>,
    );

    expect(Object.keys(await d.getDestinations())).toEqual(['foot']);
  }, 20000);

  test('media queries survive StyleSheet.create and render', async () => {
    const styles = StyleSheet.create({
      box: { width: 100, '@media max-width: 400': { width: 50 } },
    });

    // Media queries are resolved at layout time against the page size, so the
    // raw @media key is still present on the created stylesheet.
    expect(styles.box['@media max-width: 400']).toEqual({ width: 50 });

    const d = await doc(
      <Document>
        <Page size={[300, 300]}>
          <View style={styles.box} />
        </Page>
      </Document>,
    );

    expect(d.numPages).toBe(1);
  }, 20000);

  test('renderToBuffer produces a PDF', async () => {
    const buffer = await renderToBuffer(
      <Document>
        <Page size="A4">
          <Text>hi</Text>
        </Page>
      </Document>,
    );

    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(0);
    expect(buffer.subarray(0, 4).toString()).toBe('%PDF');
  }, 20000);

  test('dynamic render is called twice, gaining totalPages on the second pass', async () => {
    const seen = [];

    const d = await doc(
      <Document>
        <Page size={[200, 120]}>
          <Text
            fixed
            render={(args) => {
              seen.push(Object.keys(args).sort().join(','));
              return `${args.pageNumber}/${args.totalPages}`;
            }}
          />
          <Text break>p2</Text>
        </Page>
      </Document>,
    );

    expect(d.numPages).toBe(2);
    // First pass is the wrapping pass and only knows the page number; the
    // second pass runs once the page count is settled.
    expect([...new Set(seen)]).toEqual([
      'pageNumber',
      'pageNumber,subPageNumber,subPageTotalPages,totalPages',
    ]);
  }, 20000);

  test('View render returns plain element objects, not vue vnodes', async () => {
    const box = { backgroundColor: '#ff00ff', width: 50, height: 50 };
    const magenta = '1 0 1 ';

    const streams = (buffer) => {
      let out = '';
      let i = 0;
      for (;;) {
        const s = buffer.indexOf('stream', i);
        if (s === -1) break;
        const ds = buffer.indexOf('\n', s) + 1;
        const e = buffer.indexOf('endstream', ds);
        if (e === -1) break;
        const raw = buffer.subarray(ds, e);
        try {
          out += zlib.inflateSync(raw).toString('latin1');
        } catch {
          out += raw.toString('latin1');
        }
        i = e + 9;
      }
      return out;
    };

    const render = (fn) =>
      renderToBuffer(
        <Document>
          <Page size="A4">
            <View render={fn} style={{ width: 200, height: 100 }} />
          </Page>
        </Document>,
      );

    // createInstances only accepts elements whose `type` is a primitive string
    const plain = await render(() => ({ type: 'VIEW', props: {}, style: box }));
    expect(streams(plain)).toContain(magenta);

    // A vue vnode has a component object as its `type` and is silently dropped
    const vnode = await render(() => h(View, { style: box }));
    expect(streams(vnode)).not.toContain(magenta);
  }, 20000);

  test('orphans, widows and minPresenceAhead paginate long text', async () => {
    const d = await doc(
      <Document>
        <Page size={[200, 140]} style={{ fontSize: 10 }}>
          <Text minPresenceAhead={60}>Heading</Text>
          <Text orphans={3} widows={3}>
            {Array.from({ length: 400 }, (_, i) => `word${i}`).join(' ')}
          </Text>
        </Page>
      </Document>,
    );

    expect(d.numPages).toBeGreaterThan(1);
  }, 20000);
});
