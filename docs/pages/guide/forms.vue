<script setup lang="ts">
usePageSeo(
  "Forms",
  "Build interactive, fillable PDF forms in vue-pdf with TextInput, Checkbox, Select, List, and FieldSet.",
)

const codeExample1 = `<template>
  <Document>
    <Page size="A4" :style="{ padding: 40 }">
      <Text :style="{ fontSize: 10, marginBottom: 4 }">Full name</Text>
      <TextInput name="fullName" :style="{ height: 24 }" />
    </Page>
  </Document>
</template>`

const codeExample2 = `<template>
  <Document>
    <Page size="A4" :style="{ padding: 40 }">
      <!-- Single line -->
      <TextInput name="email" value="me@example.com" :style="{ height: 24 }" />

      <!-- Multiline, with a character limit -->
      <TextInput
        name="notes"
        multiline
        :max-length="500"
        :style="{ height: 90, fontSize: 9 }"
      />

      <!-- Masked -->
      <TextInput name="pin" password :style="{ height: 24 }" />
    </Page>
  </Document>
</template>`

const codeExample3 = `<template>
  <Document>
    <Page size="A4" :style="{ padding: 40 }">
      <!-- Unchecked -->
      <Checkbox name="subscribe" :style="{ width: 14, height: 14 }" />

      <!-- Checked, rendered as an X instead of a tick -->
      <Checkbox
        name="agree"
        checked
        x-mark
        :style="{ width: 14, height: 14 }"
      />
    </Page>
  </Document>
</template>`

const codeExample4 = `<template>
  <Document>
    <Page size="A4" :style="{ padding: 40 }">
      <!-- Dropdown -->
      <Select
        name="country"
        :select="['Nigeria', 'Ghana', 'Kenya']"
        :style="{ height: 20 }"
      />

      <!-- Scrollable list, multiple selection -->
      <List
        name="languages"
        multi-select
        :select="['English', 'French', 'Yoruba', 'Hausa']"
        :style="{ height: 60 }"
      />
    </Page>
  </Document>
</template>`

const codeExample5 = `<template>
  <Document>
    <Page size="A4" :style="{ padding: 40 }">
      <FieldSet name="billing">
        <TextInput name="street" :style="{ height: 24 }" />
        <TextInput name="city" :style="{ height: 24 }" />
      </FieldSet>

      <FieldSet name="shipping">
        <TextInput name="street" :style="{ height: 24 }" />
        <TextInput name="city" :style="{ height: 24 }" />
      </FieldSet>
    </Page>
  </Document>
</template>`

const codeExample6 = `<template>
  <Document>
    <Page size="A4" :style="{ padding: 40 }">
      <!-- Formatted as a date -->
      <TextInput
        name="dob"
        :format="{ type: 'date', param: 'dd/mm/yyyy' }"
        :style="{ height: 24 }"
      />

      <!-- Formatted as currency -->
      <TextInput
        name="amount"
        :format="{
          type: 'number',
          nDec: 2,
          sepComma: true,
          currency: '$',
          currencyPrepend: true,
        }"
        :style="{ height: 24 }"
      />
    </Page>
  </Document>
</template>`

const codeExample7 = `<script setup lang="ts">
import { Font } from '@vue-pdf/renderer'

Font.register({
  family: 'Open Sans',
  src: 'https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf',
})
<\/script>

<template>
  <Document>
    <Page size="A4" :style="{ padding: 40, fontFamily: 'Open Sans' }">
      <TextInput name="fullName" :style="{ height: 24 }" />
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Core Concepts</div>
    <h1>Forms</h1>
    <p>
      vue-pdf can produce <strong>interactive PDF forms</strong> — documents with fields a reader can fill in,
      tick, and save. Fields are backed by the PDF <strong>AcroForm</strong> specification, so they work in
      Acrobat, Preview, Chrome's built-in viewer, and most other readers.
    </p>
    <p>
      There is nothing to enable. The moment you render your first form component, vue-pdf initialises the
      document's AcroForm for you.
    </p>

    <h2>Components</h2>
    <p>Five components make up the forms API:</p>

    <ul>
      <li><strong><NuxtLink to="/api/text-input">TextInput</NuxtLink></strong> — free text, single or multiline</li>
      <li><strong><NuxtLink to="/api/checkbox">Checkbox</NuxtLink></strong> — a two-state toggle</li>
      <li><strong><NuxtLink to="/api/select">Select</NuxtLink></strong> — a dropdown of predefined options</li>
      <li><strong><NuxtLink to="/api/list">List</NuxtLink></strong> — a scrollable list of predefined options</li>
      <li><strong><NuxtLink to="/api/field-set">FieldSet</NuxtLink></strong> — an invisible grouping wrapper</li>
    </ul>

    <h2>Your First Field</h2>
    <p>
      Every field needs a <code>name</code> — that is the key the value is stored under when the form is
      filled in and exported. Fields are laid out with flexbox like any other element, so give them a size
      through <code>style</code>:
    </p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample1"
    />

    <div class="callout callout-warn">
      Form fields have no intrinsic size. A field without a <code>height</code> (and a width, if it is not
      stretching to fill its parent) collapses to nothing and will be invisible in the reader.
    </div>

    <h2>Common Props</h2>
    <p>
      Every form component except <code>&lt;FieldSet&gt;</code> accepts this shared set of props:
    </p>

    <DocsPropsTable
      :rows="[
        { name: 'name', type: 'string', default: '\'\'', description: 'Field identifier. This is the key the value is exported under.' },
        { name: 'value', type: 'string | number', description: 'The field\'s current value.' },
        { name: 'defaultValue', type: 'string | number', description: 'The value the field reverts to when the form is reset.' },
        { name: 'required', type: 'boolean', default: 'false', description: 'Marks the field as mandatory before the form can be submitted.' },
        { name: 'readOnly', type: 'boolean', default: 'false', description: 'Displays the value but prevents the reader from editing it.' },
        { name: 'noExport', type: 'boolean', default: 'false', description: 'Excludes the field from the exported form data.' },
      ]"
    />

    <div class="callout callout-tip">
      Boolean props work as bare attributes, the way they do on regular HTML elements —
      <code>&lt;Checkbox checked /&gt;</code> is the same as <code>&lt;Checkbox :checked="true" /&gt;</code>.
      Multi-word props accept either casing: <code>read-only</code> and <code>readOnly</code> are equivalent.
    </div>

    <h2>Text Fields</h2>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample2"
    />

    <p>
      Leave <code>fontSize</code> off (or set it to <code>0</code>) to let the reader auto-size text to the
      field. See the <NuxtLink to="/api/text-input">TextInput reference</NuxtLink> for the full prop list.
    </p>

    <h2>Checkboxes</h2>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample3"
    />

    <p>
      A checkbox stores one of two string states — <code>onState</code> (default <code>Yes</code>) and
      <code>offState</code> (default <code>Off</code>). Override them when your downstream consumer expects
      specific values, and keep them consistent across every checkbox in a document: some readers behave
      unpredictably when checkboxes in the same form use different state names.
    </p>

    <h2>Selects and Lists</h2>
    <p>
      <code>&lt;Select&gt;</code> renders a dropdown, <code>&lt;List&gt;</code> a scrollable box. They take
      the same props — the only difference is how the reader draws them.
    </p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample4"
    />

    <h2>Grouping With FieldSet</h2>
    <p>
      <code>&lt;FieldSet&gt;</code> draws nothing. It exists to namespace the fields inside it, which lets you
      reuse the same field names in different sections and get a structured object out when the form is read
      back:
    </p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample5"
    />

    <p>
      The fields above export as <code>billing.street</code>, <code>billing.city</code>,
      <code>shipping.street</code>, and <code>shipping.city</code>.
    </p>

    <div class="callout callout-info">
      Only <code>&lt;TextInput&gt;</code> and <code>&lt;Checkbox&gt;</code> are namespaced by their
      <code>&lt;FieldSet&gt;</code>. <code>&lt;Select&gt;</code> and <code>&lt;List&gt;</code> always register
      at the top level, so give them globally unique names. <code>&lt;FieldSet&gt;</code> also cannot be
      nested inside another <code>&lt;FieldSet&gt;</code> — use one level of grouping per field.
    </div>

    <h2>Value Formatting</h2>
    <p>
      <code>&lt;TextInput&gt;</code> accepts a <code>format</code> object that tells the reader how to
      display and validate what is typed:
    </p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample6"
    />

    <div class="callout callout-warn">
      Formatting is implemented as embedded JavaScript in the PDF. Acrobat runs it; many other readers —
      including most browser viewers — do not. Treat formatting as a progressive enhancement and never rely
      on it to validate data you actually care about.
    </div>

    <h2>Fonts</h2>
    <p>
      A form needs at least one embedded font to draw field text. vue-pdf uses whatever font is active where
      the field is rendered, so the standard PDF fonts work out of the box. If you want your fields to match
      a custom typeface, register it and set <code>fontFamily</code> on an ancestor:
    </p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample7"
    />

    <h2>Next Steps</h2>
    <p>
      See the <NuxtLink to="/examples/forms">Interactive Form example</NuxtLink> for a complete, styled
      document, or jump into the per-component references linked at the top of this page.
    </p>
  </div>
</template>
