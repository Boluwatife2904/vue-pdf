<script setup lang="ts">
export interface PropRow {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
}

interface Props {
  rows: PropRow[]
}

defineProps<Props>()
</script>

<template>
  <div class="pt-wrap">
    <table class="pt">
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.name">
          <td class="pt-name">
            <code>{{ row.name }}</code>
            <span v-if="row.required" class="req" title="Required">*</span>
          </td>
          <td class="pt-type">
            <code>{{ row.type }}</code>
          </td>
          <td class="pt-default">
            <code v-if="row.default !== undefined">{{ row.default }}</code>
            <span v-else class="dash">—</span>
          </td>
          <td class="pt-desc">{{ row.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
@reference "../assets/css/main.css";

.pt-wrap {
  @apply overflow-x-auto my-6 border border-border rounded-md;
}

.pt {
  @apply w-full border-collapse text-[13.5px];
}

th {
  @apply text-left px-4 py-2.5 text-[11px] font-bold tracking-[0.07em] uppercase border-b border-border whitespace-nowrap;
  color: var(--color-muted);
  background: rgba(255, 255, 255, 0.025);
}

td {
  @apply px-4 py-2.75 border-b border-border align-top leading-[1.55];
}

tr:last-child td {
  @apply border-b-0;
}

tr:hover td {
  background: rgba(128, 128, 128, 0.04);
}

.pt-name code {
  @apply font-mono text-[13px] bg-transparent p-0 border-none;
  color: #f0c674;
}

html.light .pt-name code {
  color: #92400e;
}

.req {
  @apply ml-0.75 text-sm leading-none;
  color: #f87171;
}

.pt-type code {
  @apply font-mono text-[12.5px] rounded-[3px] px-1.25 py-px whitespace-nowrap border border-border;
  color: #7dd3fc;
  background: var(--color-inline);
}

html.light .pt-type code {
  color: #0550ae;
}

.pt-default code {
  @apply font-mono text-[12.5px] rounded-[3px] px-1.25 py-px whitespace-nowrap border border-border;
  color: #a5d6a7;
  background: var(--color-inline);
}

html.light .pt-default code {
  color: #047857;
}

.dash {
  color: var(--color-muted);
}

.pt-desc {
  @apply max-w-85;
  color: var(--color-body);
}
</style>
