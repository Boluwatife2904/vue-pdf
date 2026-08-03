import type { Readable } from 'node:stream';
import type { DefineComponent } from 'vue';

export type PDFComponent = DefineComponent<Record<string, unknown>, any, any> | Record<string, unknown>;

export declare const version: string;
export declare const Font: any;
export declare const StyleSheet: {
  create: <T>(styles: T) => T;
};

export declare const pdf: (initialValue?: unknown) => {
  container: { type: 'ROOT'; document: unknown };
  toBlob: () => Promise<Blob>;
  toBuffer: () => Promise<Readable>;
  toString: () => Promise<string>;
  updateContainer: (doc: unknown, callback?: () => void) => void;
  on: (event: string, listener: () => void) => void;
  removeListener: (event: string, listener: () => void) => void;
};

export declare const createRenderer: (options?: { onChange?: () => void }) => any;

export declare const renderToStream: (
  element: PDFComponent,
  props?: Record<string, unknown>,
) => Promise<Readable>;
export declare const renderToBuffer: (
  element: PDFComponent,
  props?: Record<string, unknown>,
) => Promise<Buffer>;
export declare const renderToFile: (
  element: PDFComponent,
  filePath: string,
  callbackOrProps?: ((output: Readable, filePath: string) => void) | Record<string, unknown>,
  props?: Record<string, unknown>,
) => Promise<Readable>;
export declare const render: typeof renderToFile;

export declare const usePDF: any;
export declare const PDFViewer: any;
export declare const BlobProvider: any;
export declare const PDFDownloadLink: any;

export * from './primitives.js';
export * from './components/index.js';
export { tw, createTw, configureTw } from '@vue-pdf/tailwind';
