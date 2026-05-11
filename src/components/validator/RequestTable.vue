<template>
  <div>
    <div v-if="store.loading" class="text-center py-10 text-sm" style="color: var(--sidebar-text)">Loading...</div>
    <EmptyState v-else-if="store.requests.length === 0" message="No vacation requests found." />
    <div v-else class="overflow-x-auto">
      <table class="inspinia-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Period</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Submitted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="req in store.requests" :key="req.id">
            <td class="font-semibold" style="color: var(--text-heading)">{{ req.user?.name ?? "—" }}</td>
            <td class="whitespace-nowrap">{{ formatDate(req.startDate) }} → {{ formatDate(req.endDate) }}</td>
            <td style="max-width: 180px" class="truncate">{{ req.reason || "—" }}</td>
            <td><StatusBadge :status="req.status" /></td>
            <td class="whitespace-nowrap text-xs" style="color: var(--sidebar-text)">{{ formatDate(req.createdAt) }}</td>
            <td>
              <div v-if="req.status === 'Pending'" class="flex items-center gap-2 flex-wrap">
                <button @click="emit('approve', req.id)" class="btn-success">Approve</button>
                <button @click="emit('reject', req.id)" class="btn-danger">Reject</button>
                <span v-if="req.user" class="balance-info">
                  {{ req.user.vacationDaysBalance }}
                  <span class="balance-info-after">({{ req.user.vacationDaysBalance - computeDays(req.startDate, req.endDate) }})</span>
                </span>
              </div>
              <span v-else-if="req.comments" class="text-xs italic" style="color: var(--sidebar-text)" :title="req.comments">
                {{ req.comments.length > 30 ? req.comments.slice(0, 30) + '…' : req.comments }}
              </span>
              <span v-else class="text-xs" style="color: #ccc">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVacationStore } from "../../stores/vacationStore";
import StatusBadge from "../common/StatusBadge.vue";
import EmptyState from "../common/EmptyState.vue";

const store = useVacationStore();
const emit = defineEmits<{
  (e: "approve", id: number): void;
  (e: "reject", id: number): void;
}>();

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const computeDays = (start: string, end: string): number => {
  const s = new Date(start);
  const e = new Date(end);
  return Math.round((e.getTime() - s.getTime()) / 86400000) + 1;
};
</script>

<style scoped>
.balance-info {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-heading);
  white-space: nowrap;
}
.balance-info-after {
  font-weight: 400;
  color: var(--sidebar-text);
}
</style>
