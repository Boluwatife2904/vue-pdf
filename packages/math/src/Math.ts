import { defineComponent, type VNode } from 'vue';
import { parseSvg } from '@vuepdf/svg';

import { latexToSvg } from './mathjax';
import { mapSvgNode } from './mapSvg';

/**
 * Renders a LaTeX expression as SVG. The source goes in the default slot:
 * `<Math :width="200" :height="40">\int_0^\infty e^{-x^2} dx</Math>`
 */
const MathComponent = defineComponent({
  name: 'Math',
  props: {
    /** Inline (compact) mode instead of display (centered, larger). */
    inline: { type: Boolean, default: false },
    /** Width of the SVG element. If not provided, derived from the aspect ratio */
    width: { type: [Number, String], default: undefined },
    /** Height of the SVG element. If not provided, derived from the aspect ratio */
    height: { type: [Number, String], default: undefined },
    /** Color for the math expression. */
    color: { type: String, default: 'black' },
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
      const svgString = latexToSvg(slotText(), { display: !props.inline });
      const svgTree = parseSvg(svgString);

      return mapSvgNode(svgTree, 'math', {
        width: props.width,
        height: props.height,
        color: props.color,
        debug: props.debug,
      });
    };
  },
});

export default MathComponent;
