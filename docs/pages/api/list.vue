<script setup lang="ts">
usePageSeo(
  "List API",
  "API reference for the List component — scrollable option boxes in PDF forms.",
)

const codeExample1 = `<template>
  <Document>
    <Page size="A4" :style="{ padding: 40 }">
      <Text :style="{ fontSize: 10, marginBottom: 4 }">Preferred language</Text>
      <List
        name="language"
        :select="['English', 'French', 'Yoruba', 'Hausa', 'Igbo']"
        value="English"
        default-value="English"
        :style="{
          height: 60,
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
      <List
        name="skills"
        multi-select
        sort
        :select="['Vue', 'TypeScript', 'Node', 'Rust']"
        :style="{ height: 70 }"
      />
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Form Components</div>
    <h1>List</h1>
    <p>
      The <code>&lt;List&gt;</code> component adds a scrollable option box to a PDF form. It is the same field
      type as <NuxtLink to="/api/select">Select</NuxtLink> and takes the same props — the difference is that a
      list shows several options at once instead of collapsing into a dropdown.
    </p>
    <p>
      New to forms? Start with the <NuxtLink to="/guide/forms">Forms guide</NuxtLink>.
    </p>

    <h2>Props</h2>

    <DocsPropsTable
      :rows="[
        { name: 'name', type: 'string', default: '\'\'', description: 'Field identifier. This is the key the value is exported under.' },
        { name: 'select', type: 'string[]', default: '[]', description: 'The options the reader can choose from.' },
        { name: 'value', type: 'string | number', description: 'The currently selected option.' },
        { name: 'defaultValue', type: 'string | number', description: 'The option the field reverts to when the form is reset.' },
        { name: 'edit', type: 'boolean', default: 'false', description: 'Allows the reader to type a value that is not in the list.' },
        { name: 'sort', type: 'boolean', default: 'false', description: 'Displays the options in alphabetical order.' },
        { name: 'multiSelect', type: 'boolean', default: 'false', description: 'Allows more than one option to be selected.' },
        { name: 'noSpell', type: 'boolean', default: 'false', description: 'Disables spell check on typed values. Only meaningful with edit.' },
        { name: 'required', type: 'boolean', default: 'false', description: 'Marks the field as mandatory before the form can be submitted.' },
        { name: 'readOnly', type: 'boolean', default: 'false', description: 'Displays the selection but prevents the reader from changing it.' },
        { name: 'noExport', type: 'boolean', default: 'false', description: 'Excludes the field from the exported form data.' },
        { name: 'style', type: 'Style | Style[]', description: 'Size, position, and border of the field box.' },
      ]"
    />

    <h2>Usage</h2>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample1"
    />

    <div class="callout callout-tip">
      Give a list enough <code>height</code> to show several rows — roughly the number of visible options
      times your font size. Too little height and the reader shows a single cramped row with a scrollbar.
    </div>

    <h2>Multiple Selection</h2>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample2"
    />

    <div class="callout callout-info">
      Unlike <code>&lt;TextInput&gt;</code> and <code>&lt;Checkbox&gt;</code>, a <code>&lt;List&gt;</code> is
      not namespaced by an enclosing <NuxtLink to="/api/field-set">FieldSet</NuxtLink> — it always registers
      at the top level of the form. Give every list a globally unique <code>name</code>.
    </div>
  </div>
</template>
