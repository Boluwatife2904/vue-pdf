import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { mount } from '@vue/test-utils';

import { Document, Page } from '@vuepdf/renderer/components';
import { Math } from '../src/index';

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

describe('Math', () => {
  it('renders a LaTeX expression as vue-pdf SVG primitives', async () => {
    let rendered = null;

    const app = {
      render() {
        return h(
          Document,
          { onRender: (params) => (rendered = params) },
          () =>
            h(Page, { size: 'A4' }, () =>
              h(Math, { width: 200, height: 40 }, () => '\\frac{1}{2}'),
            ),
        );
      },
    };

    const wrapper = mount(app, { attachTo: document.body });
    const result = await waitFor(() => rendered);

    const layout = result._INTERNAL__LAYOUT__DATA_;
    const svgs = findTypes(layout, ['SVG']);
    expect(svgs.length).toBe(1);

    // MathJax output must contain drawable elements (paths/rects/uses mapped to G)
    const drawables = findTypes(svgs[0], ['PATH', 'RECT', 'G']);
    expect(drawables.length).toBeGreaterThan(0);

    expect(result.blob.size).toBeGreaterThan(500);

    wrapper.unmount();
  });
});
