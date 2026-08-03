// @vitest-environment jsdom
import { describe, expect, test, vi } from 'vitest';

import Reconciler, { NODE_ID_ATTRIBUTE } from '../src/index';
import treesEqual from '../src/treesEqual';

const hostConfig = {
  createInstance: (type: string, { style, children, ...props }: any) => ({
    type,
    box: {},
    style: style || {},
    props: props || {},
    children: [],
  }),
  createTextInstance: (text: string) => ({ type: 'TEXT_INSTANCE', value: text }),
  appendChild: (parent: any, child: any) => {
    const isParentText = ['TEXT', 'LINK', 'TSPAN', 'NOTE'].includes(parent.type);
    if (child.type === 'TEXT_INSTANCE' && !isParentText) {
      console.warn(`Invalid '${child.value}' string child outside <Text> component`);
      return;
    }
    parent.children.push(child);
  },
  appendChildToContainer: () => {},
  insertBefore: () => {},
  removeChild: () => {},
  removeChildFromContainer: () => {},
  commitTextUpdate: () => {},
  commitUpdate: () => {},
};

const setup = () => {
  const onInvalidate = vi.fn();
  const ctx = Reconciler(hostConfig as any).createDocumentContext({ onInvalidate });
  return { ctx, onInvalidate };
};

const el = (id: string, children: (Element | string)[] = []) => {
  const div = document.createElement('div');
  if (id) div.setAttribute(NODE_ID_ATTRIBUTE, id);
  for (const child of children) {
    if (typeof child === 'string') {
      div.appendChild(document.createTextNode(child));
    } else {
      div.appendChild(child);
    }
  }
  return div;
};

describe('reconciler', () => {
  test('assembles the internal instance tree from the DOM in document order', () => {
    const { ctx } = setup();

    ctx.register('page', 'PAGE');
    ctx.setNodeData('page', { size: 'A4' }, {});
    ctx.register('view', 'VIEW');
    ctx.setNodeData('view', {}, { margin: 10 });
    ctx.register('text', 'TEXT');
    ctx.setNodeData('text', {}, { fontSize: 14 });

    const root = el('', [el('page', [el('view', [el('text', ['Hello'])])])]);

    const tree = ctx.buildTree(root, { title: 'Doc' }, {});

    expect(tree).toMatchObject({
      type: 'DOCUMENT',
      props: { title: 'Doc' },
      children: [
        {
          type: 'PAGE',
          props: { size: 'A4' },
          children: [
            {
              type: 'VIEW',
              style: { margin: 10 },
              children: [
                {
                  type: 'TEXT',
                  children: [{ type: 'TEXT_INSTANCE', value: 'Hello' }],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  test('treats unregistered wrapper elements as transparent', () => {
    const { ctx } = setup();

    ctx.register('page', 'PAGE');
    ctx.setNodeData('page', {}, {});
    ctx.register('view', 'VIEW');
    ctx.setNodeData('view', {}, {});

    // A user component wrapping <View> in its own plain <div>
    const root = el('', [el('page', [el('', [el('view')])])]);

    const tree = ctx.buildTree(root, {}, {});
    expect(tree.children[0].children[0].type).toBe('VIEW');
  });

  test('drops orphan text and warns, keeps text under text parents', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { ctx } = setup();

    ctx.register('view', 'VIEW');
    ctx.setNodeData('view', {}, {});

    const root = el('', [el('view', ['orphan text'])]);
    const tree = ctx.buildTree(root, {}, {});

    expect(tree.children[0].children).toHaveLength(0);
    expect(warn).toHaveBeenCalledWith(
      "Invalid 'orphan text' string child outside <Text> component",
    );

    warn.mockRestore();
  });

  test('batches invalidations into a single notification', async () => {
    const { ctx, onInvalidate } = setup();

    ctx.invalidate();
    ctx.invalidate();
    ctx.invalidate();

    await new Promise((resolve) => queueMicrotask(() => resolve(null)));

    expect(onInvalidate).toHaveBeenCalledTimes(1);
  });
});

describe('treesEqual', () => {
  const tree = () => ({
    type: 'DOCUMENT',
    props: { title: 'Doc', onRender: () => {} },
    style: {},
    children: [
      {
        type: 'TEXT',
        props: {},
        style: { fontSize: 12 },
        children: [{ type: 'TEXT_INSTANCE', value: 'Hi' }],
      },
    ],
  });

  test('equal trees compare equal even with different function identities', () => {
    expect(treesEqual(tree(), tree())).toBe(true);
  });

  test('detects text changes', () => {
    const changed = tree();
    changed.children[0].children[0].value = 'Bye';
    expect(treesEqual(tree(), changed)).toBe(false);
  });

  test('detects style changes', () => {
    const changed = tree();
    changed.children[0].style.fontSize = 24;
    expect(treesEqual(tree(), changed)).toBe(false);
  });

  test('detects structural changes', () => {
    const changed = tree();
    changed.children.pop();
    expect(treesEqual(tree(), changed)).toBe(false);
  });
});
