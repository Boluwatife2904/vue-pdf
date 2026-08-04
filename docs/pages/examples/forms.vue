<script setup lang="ts">
usePageSeo(
  "Interactive Form Example",
  "A complete vue-pdf example — a fillable PDF form with text inputs, checkboxes, a dropdown, and a list.",
)

const codeExample1 = `<script setup lang="ts">
import { StyleSheet } from '@vuepdf/renderer'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fafafa',
    padding: 40,
    fontSize: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 9,
    color: '#888',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 8,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 10,
    color: '#333',
    marginBottom: 4,
  },
  input: {
    height: 24,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  textarea: {
    height: 70,
    fontSize: 9,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  checkbox: {
    width: 12,
    height: 12,
  },
  select: {
    height: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  list: {
    height: 56,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
})
<\/script>

<template>
  <Document title="Registration Form">
    <Page size="A4" :style="styles.page">
      <Text :style="styles.title">Registration</Text>
      <Text :style="styles.subtitle">
        Fill this form in your PDF reader and save a copy.
      </Text>

      <FieldSet name="applicant" :style="styles.card">
        <Text :style="styles.sectionLabel">Applicant</Text>

        <View :style="styles.fieldGroup">
          <Text :style="styles.label">Full name</Text>
          <TextInput name="fullName" required :style="styles.input" />
        </View>

        <View :style="styles.fieldGroup">
          <Text :style="styles.label">Email</Text>
          <TextInput name="email" no-spell :style="styles.input" />
        </View>

        <View :style="styles.fieldGroup">
          <Text :style="styles.label">Date of birth</Text>
          <TextInput
            name="dob"
            :format="{ type: 'date', param: 'dd/mm/yyyy' }"
            :style="styles.input"
          />
        </View>

        <View :style="styles.fieldGroup">
          <Text :style="styles.label">Phone</Text>
          <TextInput
            name="phone"
            :format="{ type: 'phone' }"
            :style="styles.input"
          />
        </View>
      </FieldSet>

      <FieldSet name="address" :style="styles.card">
        <Text :style="styles.sectionLabel">Address</Text>

        <View :style="styles.fieldGroup">
          <Text :style="styles.label">Street</Text>
          <TextInput name="street" :style="styles.input" />
        </View>

        <View :style="styles.fieldGroup">
          <Text :style="styles.label">City</Text>
          <TextInput name="city" :style="styles.input" />
        </View>
      </FieldSet>

      <View :style="styles.card">
        <Text :style="styles.sectionLabel">Preferences</Text>

        <View :style="styles.fieldGroup">
          <Text :style="styles.label">Country</Text>
          <Select
            name="country"
            :select="['', 'Nigeria', 'Ghana', 'Kenya', 'South Africa']"
            value=""
            default-value=""
            :style="styles.select"
          />
        </View>

        <View :style="styles.fieldGroup">
          <Text :style="styles.label">Languages</Text>
          <List
            name="languages"
            multi-select
            sort
            :select="['English', 'French', 'Hausa', 'Igbo', 'Yoruba']"
            :style="styles.list"
          />
        </View>

        <View :style="styles.checkboxRow">
          <Checkbox name="newsletter" checked :style="styles.checkbox" />
          <Text>Send me the monthly newsletter</Text>
        </View>

        <View :style="styles.checkboxRow">
          <Checkbox name="terms" x-mark :style="styles.checkbox" />
          <Text>I accept the terms and conditions</Text>
        </View>
      </View>

      <View :style="styles.card">
        <Text :style="styles.sectionLabel">Anything else?</Text>
        <TextInput name="notes" multiline :max-length="500" :style="styles.textarea" />
      </View>

      <View :style="styles.card">
        <Text :style="styles.sectionLabel">Office use only</Text>
        <TextInput
          name="reference"
          value="REF-0001"
          read-only
          :style="styles.input"
        />
      </View>
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Examples</div>
    <h1>Interactive Form</h1>
    <p>
      A fillable PDF form combining every form component — text inputs (including formatted, multiline, and
      read-only variants), checkboxes, a dropdown, and a multi-select list, grouped into sections with
      <code>&lt;FieldSet&gt;</code>.
    </p>

    <DocsCodeBlock
      lang="vue"
      filename="RegistrationForm.vue"
      :code="codeExample1"
    />

    <h2>Exported Data</h2>
    <p>
      When the reader fills this form in and the data is read back, the fields inside a
      <code>&lt;FieldSet&gt;</code> are namespaced under it:
    </p>

    <ul>
      <li><code>applicant.fullName</code>, <code>applicant.email</code>, <code>applicant.dob</code>, <code>applicant.phone</code></li>
      <li><code>address.street</code>, <code>address.city</code></li>
      <li><code>country</code>, <code>languages</code>, <code>newsletter</code>, <code>terms</code>, <code>notes</code>, <code>reference</code></li>
    </ul>

    <div class="callout callout-info">
      <code>&lt;Select&gt;</code> and <code>&lt;List&gt;</code> are never namespaced by a
      <code>&lt;FieldSet&gt;</code>, which is why <code>country</code> and <code>languages</code> stay at the
      top level here even though the other preference fields sit alongside them.
    </div>

    <div class="callout callout-tip">
      Try this document in the <NuxtLink to="/playground">Playground</NuxtLink> — the form components are
      available there, and you can see the fields become interactive in the embedded viewer.
    </div>
  </div>
</template>
