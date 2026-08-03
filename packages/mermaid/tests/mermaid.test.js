import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { mount } from '@vue/test-utils';

import { Document, Page } from '@vue-pdf/renderer/components';
import { Mermaid } from '../src/index';

const waitFor = async (getter, timeout = 15000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const value = getter();
    if (value) return value;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  throw new Error('Timed out waiting for PDF render');
};

const findTypes = (node, types, acc = []) => {
  if (types.includes(node.type)) acc.push(node);
  (node.children || []).forEach((child) => findTypes(child, types, acc));
  return acc;
};

const definition = `graph TD
  A[Start] --> B{Decision}
  B -->|Yes| C[OK]
  B -->|No| D[End]`;

describe('Mermaid', () => {
  it('renders a mermaid diagram as vue-pdf SVG primitives', async () => {
    let rendered = null;

    const app = {
      render() {
        return h(
          Document,
          { onRender: (params) => (rendered = params) },
          () =>
            h(Page, { size: 'A4' }, () =>
              h(Mermaid, { width: 400, height: 300 }, () => definition),
            ),
        );
      },
    };

    const wrapper = mount(app, { attachTo: document.body });
    const result = await waitFor(() => rendered);

    const layout = result._INTERNAL__LAYOUT__DATA_;
    const svgs = findTypes(layout, ['SVG']);
    expect(svgs.length).toBe(1);

    // Diagram must contain nodes (rects), edges (polylines/polygons) and labels (text)
    expect(findTypes(svgs[0], ['RECT']).length).toBeGreaterThan(0);
    expect(
      findTypes(svgs[0], ['POLYLINE', 'POLYGON']).length,
    ).toBeGreaterThan(0);
    expect(findTypes(svgs[0], ['TEXT']).length).toBeGreaterThan(0);

    expect(result.blob.size).toBeGreaterThan(500);

    wrapper.unmount();
  });
});
