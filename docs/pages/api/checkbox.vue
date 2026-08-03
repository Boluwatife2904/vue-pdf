<script setup lang="ts">
usePageSeo(
  "Checkbox API",
  "API reference for the Checkbox component — interactive tick boxes in PDF forms.",
)

const codeExample1 = `<template>
  <Document>
    <Page size="A4" :style="{ padding: 40 }">
      <View :style="{ flexDirection: 'row', alignItems: 'center', gap: 6 }">
        <Checkbox
          name="terms"
          checked
          :style="{ width: 14, height: 14 }"
        />
        <Text :style="{ fontSize: 10 }">
          I accept the terms and conditions
        </Text>
      </View>
    </Page>
  </Document>
</template>`

const codeExample2 = `<template>
  <Document>
    <Page size="A4" :style="{ padding: 40 }">
      <!-- Tick mark (default) -->
      <Checkbox name="tick" checked :style="{ width: 14, height: 14 }" />

      <!-- Cross mark -->
      <Checkbox name="cross" checked x-mark :style="{ width: 14, height: 14 }" />

      <!-- Styled interior and outline -->
      <Checkbox
        name="styled"
        background-color="#f1f5f9"
        border-color="#0f172a"
        :style="{ width: 14, height: 14 }"
      />
    </Page>
  </Document>
</template>`

const codeExample3 = `<template>
  <Document>
    <Page size="A4" :style="{ padding: 40 }">
      <Checkbox
        name="newsletter"
        checked
        on-state="Subscribed"
        off-state="Unsubscribed"
        :style="{ width: 14, height: 14 }"
      />
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Form Components</div>
    <h1>Checkbox</h1>
    <p>
      The <code>&lt;Checkbox&gt;</code> component adds an interactive tick box to a PDF form. It stores one of
      two string states, and the reader toggles between them.
    </p>
    <p>
      New to forms? Start with the <NuxtLink to="/guide/forms">Forms guide</NuxtLink>.
    </p>

    <h2>Props</h2>

    <DocsPropsTable
      :rows="[
        { name: 'name', type: 'string', default: '\'\'', description: 'Field identifier. This is the key the value is exported under.' },
        { name: 'checked', type: 'boolean', default: 'false', description: 'Whether the box starts in its on state.' },
        { name: 'onState', type: 'string', default: '\'Yes\'', description: 'Value exported when the box is ticked.' },
        { name: 'offState', type: 'string', default: '\'Off\'', description: 'Value exported when the box is not ticked.' },
        { name: 'xMark', type: 'boolean', default: 'false', description: 'Draw a cross instead of a tick when checked.' },
        { name: 'backgroundColor', type: 'string', description: 'Interior colour of the box.' },
        { name: 'borderColor', type: 'string', description: 'Outline colour of the box.' },
        { name: 'value', type: 'string | number', description: 'The field\'s current value. Usually set through checked instead.' },
        { name: 'defaultValue', type: 'string | number', description: 'The value the field reverts to when the form is reset.' },
        { name: 'required', type: 'boolean', default: 'false', description: 'Marks the field as mandatory before the form can be submitted.' },
        { name: 'readOnly', type: 'boolean', default: 'false', description: 'Displays the state but prevents the reader from toggling it.' },
        { name: 'noExport', type: 'boolean', default: 'false', description: 'Excludes the field from the exported form data.' },
        { name: 'style', type: 'Style | Style[]', description: 'Size and position of the box.' },
      ]"
    />

    <h2>Usage</h2>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample1"
    />

    <div class="callout callout-warn">
      A <code>&lt;Checkbox&gt;</code> has no intrinsic size. Give it an explicit <code>width</code> and
      <code>height</code> or it will be invisible. Square dimensions look best in most readers.
    </div>

    <h2>Appearance</h2>
    <p>
      The tick and cross glyphs come from the ZapfDingbats font, which vue-pdf embeds automatically the first
      time a checkbox is rendered.
    </p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample2"
    />

    <h2>Custom States</h2>
    <p>
      By default a checkbox exports <code>Yes</code> or <code>Off</code>. Override
      <code>onState</code> and <code>offState</code> when the system consuming the form expects specific
      values:
    </p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample3"
    />

    <div class="callout callout-info">
      Use the same <code>onState</code> and <code>offState</code> for every checkbox in a document. Readers
      differ in how they handle a form whose checkboxes use inconsistent state names, and mixed naming is a
      common source of boxes that appear blank or refuse to toggle.
    </div>

    <h2>Grouping</h2>
    <p>
      Wrap checkboxes in a <NuxtLink to="/api/field-set">FieldSet</NuxtLink> to namespace them under a shared
      prefix.
    </p>
  </div>
</template>
