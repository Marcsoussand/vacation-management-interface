<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="opt in options"
      :key="opt.value"
      @click="emit('change', opt.value)"
      class="text-xs font-semibold px-3 py-1.5 border rounded transition-colors"
      :style="modelValue === opt.value
        ? 'background: var(--color-primary); color: #fff; border-color: var(--color-primary)'
        : 'background: #fff; color: var(--text-primary); border-color: var(--panel-border)'"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { RequestStatus } from "../../types";

defineProps<{ modelValue: RequestStatus | "All" }>();
const emit = defineEmits<{ (e: "change", value: RequestStatus | "All"): void }>();

const options: { label: string; value: RequestStatus | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];
</script>
