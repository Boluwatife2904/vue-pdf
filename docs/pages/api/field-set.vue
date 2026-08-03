<script setup lang="ts">
usePageSeo(
  "FieldSet API",
  "API reference for the FieldSet component — grouping and namespacing PDF form fields.",
)

const codeExample1 = `<template>
  <Document>
    <Page size="A4" :style="{ padding: 40 }">
      <FieldSet name="billing">
        <Text :style="{ fontSize: 10, marginBottom: 4 }">Street</Text>
        <TextInput name="street" :style="{ height: 24 }" />

        <Text :style="{ fontSize: 10, marginBottom: 4 }">City</Text>
        <TextInput name="city" :style="{ height: 24 }" />
      </FieldSet>

      <FieldSet name="shipping">
        <Text :style="{ fontSize: 10, marginBottom: 4 }">Street</Text>
        <TextInput name="street" :style="{ height: 24 }" />

        <Text :style="{ fontSize: 10, marginBottom: 4 }">City</Text>
        <TextInput name="city" :style="{ height: 24 }" />
      </FieldSet>
    </Page>
  </Document>
</template>`

const codeExample2 = `<template>
  <Document>
    <Page size="A4" :style="{ padding: 40 }">
      <FieldSet
        name="applicant"
        :style="{
          padding: 16,
          borderWidth: 1,
          borderColor: '#e2e8f0',
          borderRadius: 4,
        }"
      >
        <Text :style="{ fontSize: 8, color: '#94a3b8', marginBottom: 12 }">
          APPLICANT
        </Text>

        <View :style="{ marginBottom: 12 }">
          <Text :style="{ fontSize: 10, marginBottom: 4 }">Full name</Text>
          <TextInput name="fullName" :style="{ height: 24 }" />
        </View>

        <View :style="{ flexDirection: 'row', alignItems: 'center', gap: 6 }">
          <Checkbox name="consent" :style="{ width: 12, height: 12 }" />
          <Text :style="{ fontSize: 9 }">I consent to being contacted</Text>
        </View>
      </FieldSet>
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Form Components</div>
    <h1>FieldSet</h1>
    <p>
      The <code>&lt;FieldSet&gt;</code> component groups form fields under a shared name. It draws nothing on
      its own — its purpose is to create a hierarchy in the exported form data, so the same field name can be
      reused in different sections of a document.
    </p>
    <p>
      New to forms? Start with the <NuxtLink to="/guide/forms">Forms guide</NuxtLink>.
    </p>

    <h2>Props</h2>
    <p>
      <code>&lt;FieldSet&gt;</code> does not take the common form props — it is a container, not a field.
    </p>

    <DocsPropsTable
      :rows="[
        { name: 'name', type: 'string', required: true, description: 'Prefix applied to the names of the fields inside.' },
        { name: 'style', type: 'Style | Style[]', description: 'Layout and decoration. FieldSet lays out like a View, so it can carry padding, borders, and background.' },
      ]"
    />

    <h2>Usage</h2>
    <p>
      Two sections can each have a <code>street</code> and a <code>city</code> field without colliding:
    </p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample1"
    />

    <p>
      The fields above export as <code>billing.street</code>, <code>billing.city</code>,
      <code>shipping.street</code>, and <code>shipping.city</code>.
    </p>

    <h2>Layout</h2>
    <p>
      Although it is invisible to the form, a <code>&lt;FieldSet&gt;</code> participates in layout exactly
      like a <NuxtLink to="/api/view">View</NuxtLink>, so you can use it as the card or panel that wraps a
      section:
    </p>

    <DocsCodeBlock
      lang="vue"
      :code="codeExample2"
    />

    <h2>Limitations</h2>

    <div class="callout callout-warn">
      <p>
        Only <code>&lt;TextInput&gt;</code> and <code>&lt;Checkbox&gt;</code> are namespaced by their
        enclosing <code>&lt;FieldSet&gt;</code>. <code>&lt;Select&gt;</code> and <code>&lt;List&gt;</code>
        always register at the top level of the form, so they need globally unique names.
      </p>
      <p>
        <code>&lt;FieldSet&gt;</code> also cannot be nested inside another <code>&lt;FieldSet&gt;</code>.
        Use a single level of grouping per field.
      </p>
    </div>

    <div class="callout callout-info">
      Fields do not have to be direct children of the <code>&lt;FieldSet&gt;</code>. Any field anywhere in the
      subtree picks up the prefix, so you are free to nest <code>&lt;View&gt;</code>s for layout.
    </div>
  </div>
</template>
