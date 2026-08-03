import { describe, expect, test } from 'vitest';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

import {
  Checkbox,
  Document,
  FieldSet,
  List,
  Page,
  Select,
  TextInput,
  renderToBuffer,
} from '@vue-pdf/renderer';
import { normalizeAttrs } from '../src/components/createPrimitive';

/**
 * Renders a document and returns pdf.js' view of its AcroForm fields, keyed by
 * field name. `getFieldObjects` reads the /AcroForm /Fields tree, so it only
 * returns anything when the form primitives actually initialised the form.
 */
const getFields = async (element) => {
  const buffer = await renderToBuffer(element);

  const document = await getDocument({
    data: new Uint8Array(buffer),
    verbosity: 0,
  }).promise;

  return (await document.getFieldObjects()) || {};
};

const box = { width: 120, height: 20 };

describe('forms', () => {
  test('should create an AcroForm with a field per primitive', async () => {
    const fields = await getFields(
      <Document>
        <Page size={[300, 300]} style={{ padding: 10 }}>
          <TextInput name="fullName" style={box} />
          <Checkbox name="agree" style={{ width: 20, height: 20 }} />
          <Select name="country" select={['NG', 'US']} style={box} />
          <List name="colors" select={['red', 'green']} style={box} />
        </Page>
      </Document>,
    );

    expect(Object.keys(fields).sort()).toEqual([
      'agree',
      'colors',
      'country',
      'fullName',
    ]);

    expect(fields.fullName[0].type).toBe('text');
    expect(fields.agree[0].type).toBe('checkbox');
    expect(fields.country[0].type).toBe('combobox');
    expect(fields.colors[0].type).toBe('listbox');
  });

  test('should namespace fields under their FieldSet', async () => {
    const fields = await getFields(
      <Document>
        <Page size={[300, 300]} style={{ padding: 10 }}>
          <FieldSet name="address">
            <TextInput name="street" style={box} />
            <TextInput name="city" style={box} />
          </FieldSet>
        </Page>
      </Document>,
    );

    // The FieldSet itself is the parent field; its children are addressed
    // through it, which is what makes grouped data extraction work.
    expect(Object.keys(fields).sort()).toEqual([
      'address',
      'address.city',
      'address.street',
    ]);
  });

  test('should apply TextInput props', async () => {
    const fields = await getFields(
      <Document>
        <Page size={[300, 300]} style={{ padding: 10 }}>
          <TextInput
            name="notes"
            value="hello"
            multiline
            maxLength={40}
            readOnly
            style={box}
          />
        </Page>
      </Document>,
    );

    const [field] = fields.notes;

    expect(field.value).toBe('hello');
    expect(field.multiline).toBe(true);
    expect(field.charLimit).toBe(40);
    // pdf.js surfaces readOnly as the inverse `editable` flag
    expect(field.editable).toBe(false);
  });

  test('should honour checked on Checkbox', async () => {
    const fields = await getFields(
      <Document>
        <Page size={[300, 300]} style={{ padding: 10 }}>
          <Checkbox name="on" checked style={{ width: 20, height: 20 }} />
          <Checkbox name="off" style={{ width: 20, height: 20 }} />
        </Page>
      </Document>,
    );

    expect(fields.on[0].value).toBe('Yes');
    expect(fields.off[0].value).toBe('Off');
  });

  test('should expose Select options', async () => {
    const fields = await getFields(
      <Document>
        <Page size={[300, 300]} style={{ padding: 10 }}>
          <Select name="country" select={['Nigeria', 'Ghana']} style={box} />
        </Page>
      </Document>,
    );

    expect(fields.country[0].items).toEqual([
      { displayValue: 'Nigeria', exportValue: 'Nigeria' },
      { displayValue: 'Ghana', exportValue: 'Ghana' },
    ]);
  });

  test('should not create an AcroForm without form primitives', async () => {
    const fields = await getFields(
      <Document>
        <Page size={[300, 300]} />
      </Document>,
    );

    expect(fields).toEqual({});
  });

  // `<Checkbox xMark />` in a template arrives as an empty string, the way JSX
  // passes a literal `true`. Every boolean form prop must survive that.
  test('should treat bare boolean form attributes as true', () => {
    const { props } = normalizeAttrs({
      required: '',
      noExport: '',
      readOnly: '',
      multiline: '',
      password: '',
      noSpell: '',
      checked: '',
      xMark: '',
      sort: '',
      edit: '',
      multiSelect: '',
    });

    expect(props).toEqual({
      required: true,
      noExport: true,
      readOnly: true,
      multiline: true,
      password: true,
      noSpell: true,
      checked: true,
      xMark: true,
      sort: true,
      edit: true,
      multiSelect: true,
    });
  });
});
