import * as components from '../components/index.js';

import usePDF from './usePDF.js';
import PDFViewer from './PDFViewer.vue';
import BlobProvider from './BlobProvider.vue';
import PDFDownloadLink from './PDFDownloadLink.vue';
import { pdf, version, Font, StyleSheet } from '../index.js';

const throwEnvironmentError = (name) => {
  throw new Error(
    `${name} is a Node specific API. You're either using this method in a browser, or your bundler is not loading vue-pdf from the appropriate web build.`,
  );
};

export const renderToStream = () => {
  throwEnvironmentError('renderToStream');
};

export const renderToBuffer = () => {
  throwEnvironmentError('renderToBuffer');
};

export const renderToFile = () => {
  throwEnvironmentError('renderToFile');
};

export const render = () => {
  throwEnvironmentError('render');
};

export * from '../index.js';

export { usePDF };
export { PDFViewer };
export { BlobProvider };
export { PDFDownloadLink };

// In react-pdf these names are re-exported string primitives; the Vue analog
// exports real components under the same names.
export * from '../components/index.js';

export default {
  pdf,
  usePDF,
  Font,
  version,
  StyleSheet,
  PDFViewer,
  BlobProvider,
  PDFDownloadLink,
  renderToStream,
  renderToBuffer,
  renderToFile,
  render,
  ...components,
};
