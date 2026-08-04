import { defineComponent, type VNode } from 'vue';
import { parseSvg } from '@vuepdf/svg';

import { mermaidToSvg } from './render';
import { preprocessSvg } from './preprocessSvg';
import { mapSvgNode } from './mapSvg';
import type { MermaidRenderOptions } from './render';

/** Renders a Mermaid diagram as SVG. The definition goes in the default slot. */
const Mermaid = defineComponent({
  name: 'Mermaid',
  props: {
    /** Width of the rendered SVG. If not provided, derived from viewBox aspect ratio. */
    width: { type: [Number, String], default: undefined },
    /** Height of the rendered SVG. If not provided, derived from viewBox aspect ratio. */
    height: { type: [Number, String], default: undefined },
    /** Foreground/text color. */
    color: { type: String, default: undefined },
    /** Background color for the diagram. */
    bg: { type: String, default: undefined },
    /** Accent color (arrowheads, highlights). */
    accent: { type: String, default: undefined },
    /** Edge/connector stroke color. */
    line: { type: String, default: undefined },
    /** Secondary text and label color. */
    muted: { type: String, default: undefined },
    /** Node fill tint color. */
    surface: { type: String, default: undefined },
    /** Node stroke color. */
    border: { type: String, default: undefined },
    /** Use transparent background. */
    transparent: { type: Boolean, default: undefined },
    /** Built-in theme name — see the Math & Diagrams docs for the full list. */
    theme: { type: String, default: undefined },
    /** Adds a visible border around the SVG element for debugging layout. */
    debug: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    const slotText = (): string => {
      const nodes = slots.default ? slots.default() : [];
      return nodes
        .map((node: VNode) =>
          typeof node.children === 'string' ? node.children : '',
        )
        .join('');
    };

    return () => {
      const renderOptions: MermaidRenderOptions = {};

      if (props.color) renderOptions.fg = props.color;
      if (props.bg) renderOptions.bg = props.bg;
      if (props.accent) renderOptions.accent = props.accent;
      if (props.line) renderOptions.line = props.line;
      if (props.muted) renderOptions.muted = props.muted;
      if (props.surface) renderOptions.surface = props.surface;
      if (props.border) renderOptions.border = props.border;
      if (props.transparent) renderOptions.transparent = props.transparent;
      if (props.theme) renderOptions.theme = props.theme;

      const rawSvg = mermaidToSvg(slotText(), renderOptions);

      const svgString = preprocessSvg(rawSvg, {
        fg: props.color,
        bg: props.bg,
        accent: props.accent,
        line: props.line,
        muted: props.muted,
        surface: props.surface,
        border: props.border,
      });

      const svgTree = parseSvg(svgString);

      if (!svgTree) return null;

      const svgWidth = props.width ?? svgTree.props.width;
      const svgHeight = props.height ?? svgTree.props.height;

      return mapSvgNode(svgTree, 'mermaid', {
        width: svgWidth ? Number(svgWidth) : undefined,
        height: svgHeight ? Number(svgHeight) : undefined,
        color: props.color || 'black',
        debug: props.debug,
      });
    };
  },
});

export default Mermaid;
