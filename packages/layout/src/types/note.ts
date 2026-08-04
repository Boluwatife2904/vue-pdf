import * as P from '@vuepdf/primitives';
import { SafeStyle, Style } from '@vuepdf/stylesheet';

import { NodeProps } from './base';
import { SafeTextInstanceNode, TextInstanceNode } from './text-instance';

export type NoteNode = {
  type: typeof P.Note;
  props: NodeProps;
  style?: Style | Style[];
  box?: never;
  origin?: never;
  yogaNode?: never;
  children?: TextInstanceNode[];
};

export type SafeNoteNode = Omit<NoteNode, 'style' | 'children'> & {
  style: SafeStyle;
  children?: SafeTextInstanceNode[];
};
