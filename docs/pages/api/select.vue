<script setup lang="ts">
usePageSeo(
  "Select API",
  "API reference for the Select component — dropdown menus in PDF forms.",
)

const codeExample1 = `<template>
  <Document>
    <Page size="A4" :style="{ padding: 40 }">
      <Text :style="{ fontSize: 10, marginBottom: 4 }">Country</Text>
      <Select
        name="country"
        :select="['Nigeria', 'Ghana', 'Kenya', 'South Africa']"
        value="Nigeria"
        default-value="Nigeria"
        :style="{
          height: 20,
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
      <!-- Sorted alphabetically, reader may type a custom value -->
      <Select
        name="role"
        edit
        sort
        no-spell
        :select="['Engineer', 'Designer', 'Analyst']"
        :style="{ height: 20 }"
      />
    </Page>
  </Document>
</template>`

const codeExample3 = `<template>
  <Document>
    <Page size="A4" :style="{ padding: 40 }">
      <Select
        name="country"
        :select="['', 'Nigeria', 'Ghana']"
        value=""
        default-value=""
        :style="{ height: 20 }"
      />
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Form Components</div>
    <h1>Select</h1>
    <p>
      The <code>&lt;Select&gt;</code> component adds a dropdown menu to a PDF form. The reader picks from a
      list of options you define through the <code>select</code> prop.
    </p>
    <p>
      For a scrollable box rather than a dropdown, use <NuxtLink to="/api/list">List</NuxtLink> — it takes the
      same props. New to forms? Start with the <NuxtLink to="/guide/forms">Forms guide</NuxtLink>.
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

    <div class="callout callout-warn">
      A <code>&lt;Select&gt;</code> has no intrinsic size. Give it a <code>height</code> — and a
      <code>width</code> if it is not stretching to fill its parent — or it will be invisible.
    </div>

    <h2>Editable and Sorted</h2>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample2"
    />

    <h2>Empty Initial Selection</h2>
    <p>
      A dropdown always shows its first option. To start a field blank, include an empty string as the first
      option and set <code>value</code> to it:
    </p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample3"
    />

    <div class="callout callout-info">
      Unlike <code>&lt;TextInput&gt;</code> and <code>&lt;Checkbox&gt;</code>, a <code>&lt;Select&gt;</code>
      is not namespaced by an enclosing <NuxtLink to="/api/field-set">FieldSet</NuxtLink> — it always
      registers at the top level of the form. Give every select a globally unique <code>name</code>.
    </div>
  </div>
</template>
