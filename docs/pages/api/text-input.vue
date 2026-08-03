<script setup lang="ts">
usePageSeo(
  "TextInput API",
  "API reference for the TextInput component — interactive text fields in PDF forms.",
)

const codeExample1 = `<template>
  <Document>
    <Page size="A4" :style="{ padding: 40 }">
      <Text :style="{ fontSize: 10, marginBottom: 4 }">Full name</Text>
      <TextInput
        name="fullName"
        value="Ada Lovelace"
        :style="{
          height: 24,
          borderWidth: 1,
          borderColor: '#cbd5e1',
        }"
      />
    </Page>
  </Document>
</template>`

const codeExample2 = `<template>
  <Document>
    <Page size="A4" :style="{ padding: 40 }">
      <TextInput
        name="notes"
        multiline
        no-spell
        :max-length="500"
        align="left"
        :style="{ height: 100, fontSize: 9 }"
      />
    </Page>
  </Document>
</template>`

const codeExample3 = `<template>
  <Document>
    <Page size="A4" :style="{ padding: 40 }">
      <!-- dd/mm/yyyy date field -->
      <TextInput
        name="dob"
        :format="{ type: 'date', param: 'dd/mm/yyyy' }"
        :style="{ height: 24 }"
      />

      <!-- Currency with two decimals and thousands separators -->
      <TextInput
        name="total"
        :format="{
          type: 'number',
          nDec: 2,
          sepComma: true,
          negStyle: 'ParensRed',
          currency: '$',
          currencyPrepend: true,
        }"
        :style="{ height: 24 }"
      />

      <!-- Phone number -->
      <TextInput
        name="phone"
        :format="{ type: 'phone' }"
        :style="{ height: 24 }"
      />
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Form Components</div>
    <h1>TextInput</h1>
    <p>
      The <code>&lt;TextInput&gt;</code> component adds an interactive text field to a PDF form. Readers can
      type into it, and the value is exported under the field's <code>name</code>.
    </p>
    <p>
      New to forms? Start with the <NuxtLink to="/guide/forms">Forms guide</NuxtLink>.
    </p>

    <h2>Props</h2>

    <DocsPropsTable
      :rows="[
        { name: 'name', type: 'string', default: '\'\'', description: 'Field identifier. This is the key the value is exported under.' },
        { name: 'value', type: 'string | number', description: 'The field\'s current value.' },
        { name: 'defaultValue', type: 'string | number', description: 'The value the field reverts to when the form is reset.' },
        { name: 'align', type: '\'left\' | \'center\' | \'right\'', default: '\'left\'', description: 'Horizontal alignment of the text inside the field.' },
        { name: 'multiline', type: 'boolean', default: 'false', description: 'Allows the value to wrap across multiple lines.' },
        { name: 'password', type: 'boolean', default: 'false', description: 'Masks the typed characters.' },
        { name: 'noSpell', type: 'boolean', default: 'false', description: 'Disables the reader\'s spell check for this field.' },
        { name: 'fontSize', type: 'number', description: 'Size of the field text. Omit or set to 0 for auto sizing.' },
        { name: 'maxLength', type: 'number', description: 'Maximum number of characters the field accepts.' },
        { name: 'format', type: 'TextInputFormatting', description: 'Display and validation formatting. See Formatting below.' },
        { name: 'required', type: 'boolean', default: 'false', description: 'Marks the field as mandatory before the form can be submitted.' },
        { name: 'readOnly', type: 'boolean', default: 'false', description: 'Displays the value but prevents the reader from editing it.' },
        { name: 'noExport', type: 'boolean', default: 'false', description: 'Excludes the field from the exported form data.' },
        { name: 'style', type: 'Style | Style[]', description: 'Size, position, and border of the field box.' },
      ]"
    />

    <h2>Usage</h2>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample1"
    />

    <div class="callout callout-warn">
      A <code>&lt;TextInput&gt;</code> has no intrinsic size. Always give it a <code>height</code> — and a
      <code>width</code> if it is not stretching to fill its parent — or it will be invisible.
    </div>

    <h2>Multiline</h2>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample2"
    />

    <h2>Formatting</h2>
    <p>
      The <code>format</code> prop attaches keystroke and display formatters to the field. It takes an object
      with a <code>type</code> and, for some types, extra parameters:
    </p>

    <DocsPropsTable
      :rows="[
        { name: 'type', type: '\'date\' | \'time\' | \'percent\' | \'number\' | \'zip\' | \'zipPlus4\' | \'phone\' | \'ssn\'', required: true, description: 'The kind of formatting to apply.' },
        { name: 'param', type: 'string', description: 'Format mask for date and time types, e.g. \'dd/mm/yyyy\' or \'HH:MM\'.' },
        { name: 'nDec', type: 'number', description: 'Number of decimal places. Used by number and percent.' },
        { name: 'sepComma', type: 'boolean', description: 'Use a comma as the thousands separator. Used by number and percent.' },
        { name: 'negStyle', type: '\'MinusBlack\' | \'Red\' | \'ParensBlack\' | \'ParensRed\'', description: 'How negative values are displayed. Used by number.' },
        { name: 'currency', type: 'string', description: 'Currency symbol to display. Used by number.' },
        { name: 'currencyPrepend', type: 'boolean', description: 'Place the currency symbol before the value rather than after. Used by number.' },
      ]"
    />

    <DocsCodeBlock
      lang="vue"
      :code="codeExample3"
    />

    <div class="callout callout-warn">
      Formatting is embedded in the PDF as JavaScript. Acrobat executes it; most browser viewers and many
      other readers do not. Never rely on it to validate data you care about — validate on the way in
      instead.
    </div>

    <h2>Grouping</h2>
    <p>
      Wrap fields in a <NuxtLink to="/api/field-set">FieldSet</NuxtLink> to namespace them, so the same field
      name can be reused across sections of the form.
    </p>
  </div>
</template>
