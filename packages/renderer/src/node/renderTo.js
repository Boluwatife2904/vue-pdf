import fs from 'fs';
import { Buffer } from 'buffer';
import { createSSRApp } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { PDFSinkKey } from '@vue-pdf/reconciler';

import { pdf } from '../index.js';
import * as components from '../components/index.js';

const isVueComponent = (element) => {
  if (!element) return false;
  if (typeof element === 'function') return true;
  if (typeof element !== 'object') return false;
  if ('type' in element) return false;

  return Boolean(
    element.setup ||
      element.render ||
      element.template ||
      element.__vccOpts ||
      element.__name,
  );
};

const renderVueComponentToTree = async (component, props = {}) => {
  let documentContext = null;
  let documentProps = {};
  let documentStyle = {};

  const app = createSSRApp(component, props);

  for (const [name, component] of Object.entries(components)) {
    app.component(name, component);
    app.component(`VuePdf${name}`, component);
  }

  app.provide(PDFSinkKey, {
    updateDocument: () => {},
    registerDocumentContext: (context, props, style) => {
      documentContext = context;
      documentProps = props;
      documentStyle = style;
    },
  });

  const html = await renderToString(app);

  if (!documentContext) {
    throw new Error(
      'renderToStream/renderToBuffer expected a Vue component that renders a <Document> root.',
    );
  }

  return documentContext.buildTreeFromHtml(
    html,
    documentProps,
    documentStyle,
  );
};

const resolveElement = async (element, props) => {
  if (isVueComponent(element)) {
    return renderVueComponentToTree(element, props);
  }

  return element;
};

export const renderToStream = async (element, props) => {
  const instance = pdf(await resolveElement(element, props));
  const stream = await instance.toBuffer();
  return stream;
};

export const renderToFile = async (
  element,
  filePath,
  callbackOrProps,
  maybeProps,
) => {
  const callback =
    typeof callbackOrProps === 'function' ? callbackOrProps : undefined;
  const props = typeof callbackOrProps === 'function' ? maybeProps : callbackOrProps;
  const output = await renderToStream(element, props);
  const stream = fs.createWriteStream(filePath);

  output.pipe(stream);

  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      if (callback) callback(output, filePath);
      resolve(output);
    });
    stream.on('error', reject);
  });
};

export const renderToBuffer = (element, props) =>
  renderToStream(element, props).then(
    (stream) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', (error) => reject(error));
      }),
  );
