<template>
  <span :class="['label-badge', labelClass[status]]">{{ status }}</span>
</template>

<script setup lang="ts">
import type { RequestStatus } from "../../types";

defineProps<{ status: RequestStatus }>();

const labelClass: Record<RequestStatus, string> = {
  Pending: "label-badge-pending",
  Approved: "label-badge-approved",
  Rejected: "label-badge-rejected",
};
</script>
