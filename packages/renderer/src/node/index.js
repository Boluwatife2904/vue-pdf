import * as primitives from '../primitives.js';

import { renderToFile, renderToStream, renderToBuffer } from './renderTo.js';
import { pdf, version, Font, StyleSheet } from '../index.js';

const throwEnvironmentError = (name) => {
  throw new Error(
    `${name} is a web specific API. You're either using this component on Node, or your bundler is not loading vue-pdf from the appropriate web build.`,
  );
};

export const usePDF = () => {
  throwEnvironmentError('usePDF');
};

export const PDFViewer = () => {
  throwEnvironmentError('PDFViewer');
};

export const PDFDownloadLink = () => {
  throwEnvironmentError('PDFDownloadLink');
};

export const BlobProvider = () => {
  throwEnvironmentError('BlobProvider');
};

export const render = renderToFile;

export * from '../index.js';

export * from './renderTo.js';

export * from '../primitives.js';

export default {
  pdf,
  Font,
  version,
  StyleSheet,
  usePDF,
  PDFViewer,
  BlobProvider,
  PDFDownloadLink,
  renderToStream,
  renderToBuffer,
  renderToFile,
  render,
  ...primitives,
};
