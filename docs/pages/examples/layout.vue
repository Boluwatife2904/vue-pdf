<script setup lang="ts">
usePageSeo(
  "Page Layout Example",
  "Vue-pdf layout examples — multi-column layouts, fixed headers/footers, and pagination.",
)

const codeExample1 = `<template>
  <Document>
    <Page size="A4" :style="{ padding: 50, paddingTop: 80 }">
      <!-- Fixed Header -->
      <View :fixed="true" :style="{
        position: 'absolute',
        top: 30,
        left: 50,
        right: 50,
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: 12,
      }">
        <Text :style="{ fontSize: 18, fontWeight: 'bold', color: '#dc2626' }">
          INVOICE
        </Text>
        <Text :style="{ fontSize: 10, color: '#6b7280', marginTop: 4 }">
          #INV-2024-001 | Date: Jan 15, 2024
        </Text>
      </View>

      <!-- Fixed Footer -->
      <View :fixed="true" :style="{
        position: 'absolute',
        bottom: 30,
        left: 50,
        right: 50,
        borderTop: '1px solid #e5e7eb',
        paddingTop: 12,
      }">
        <Text :style="{
          fontSize: 8,
          color: '#9ca3af',
          textAlign: 'center',
        }">
          Page <Text render="{(p) => p.pageNumber}" /> | Company Name Inc.
        </Text>
      </View>

      <!-- From / To -->
      <View :style="{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
      }">
        <View>
          <Text :style="{ fontSize: 10, fontWeight: 'bold', marginBottom: 4 }">From:</Text>
          <Text :style="{ fontSize: 10, color: '#6b7280' }">Company Name Inc.</Text>
          <Text :style="{ fontSize: 10, color: '#6b7280' }">123 Business St</Text>
          <Text :style="{ fontSize: 10, color: '#6b7280' }">Commerce, CA 90001</Text>
        </View>
        <View>
          <Text :style="{ fontSize: 10, fontWeight: 'bold', marginBottom: 4 }">To:</Text>
          <Text :style="{ fontSize: 10, color: '#6b7280' }">Client Name</Text>
          <Text :style="{ fontSize: 10, color: '#6b7280' }">456 Client Ave</Text>
          <Text :style="{ fontSize: 10, color: '#6b7280' }">Business, NY 10001</Text>
        </View>
      </View>

      <!-- Table -->
      <View>
        <!-- Header -->
        <View :style="{
          flexDirection: 'row',
          backgroundColor: '#f3f4f6',
          padding: 8,
          borderBottom: '2px solid #e5e7eb',
        }">
          <Text :style="{ flex: 3, fontSize: 9, fontWeight: 'bold' }">Item</Text>
          <Text :style="{ flex: 1, fontSize: 9, fontWeight: 'bold', textAlign: 'right' }">Qty</Text>
          <Text :style="{ flex: 1, fontSize: 9, fontWeight: 'bold', textAlign: 'right' }">Rate</Text>
          <Text :style="{ flex: 1, fontSize: 9, fontWeight: 'bold', textAlign: 'right' }">Amount</Text>
        </View>

        <!-- Rows -->
        <View :style="{ flexDirection: 'row', padding: 8, borderBottom: '1px solid #e5e7eb' }">
          <Text :style="{ flex: 3, fontSize: 9, color: '#374151' }">Web Design</Text>
          <Text :style="{ flex: 1, fontSize: 9, color: '#374151', textAlign: 'right' }">1</Text>
          <Text :style="{ flex: 1, fontSize: 9, color: '#374151', textAlign: 'right' }">$2,500</Text>
          <Text :style="{ flex: 1, fontSize: 9, color: '#374151', textAlign: 'right' }">$2,500</Text>
        </View>
      </View>

      <!-- Total -->
      <View :style="{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
      }">
        <Text :style="{
          fontSize: 14,
          fontWeight: 'bold',
          color: '#dc2626',
        }">
          Total: $2,500.00
        </Text>
      </View>
    </Page>
  </Document>
</template>`
</script>

<template>
  <div class="prose">
    <div class="page-label">Examples</div>
    <h1>Page Layout</h1>
    <p>Examples of common page layouts with headers, footers, and multi-column designs.</p>

    <h2>Invoice Layout</h2>

    <DocsCodeBlock
      lang="vue"
      filename="InvoiceDocument.vue"
      :code="codeExample1"
    />
  </div>
</template>
