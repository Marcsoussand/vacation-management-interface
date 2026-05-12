<template>
  <div class="ibox">
    <div class="ibox-title">
      <h5>My Submitted Requests</h5>
    </div>
    <div class="ibox-content" style="padding: 0">
      <div v-if="store.loading" class="text-center py-8 text-sm" style="color: var(--sidebar-text)">Loading...</div>
      <EmptyState v-else-if="store.requests.length === 0" message="You have no vacation requests yet." />
      <table v-else class="inspinia-table">
        <thead>
          <tr>
            <th>Period</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Manager comment</th>
            <th>Submitted</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="req in store.requests" :key="req.id">
            <td class="whitespace-nowrap font-medium" style="color: var(--text-heading)">
              {{ formatDate(req.startDate) }} → {{ formatDate(req.endDate) }}
            </td>
            <td style="max-width: 200px" class="truncate">{{ req.reason || "—" }}</td>
            <td><StatusBadge :status="req.status" /></td>
            <td class="text-xs" style="color: var(--color-danger)">{{ req.comments || "—" }}</td>
            <td class="text-xs whitespace-nowrap" style="color: var(--sidebar-text)">{{ formatDate(req.createdAt) }}</td>
            <td>
              <div v-if="req.status === 'Pending'" class="flex gap-2">
                <button class="btn-edit" @click="openEdit(req)">Edit</button>
                <button class="btn-delete" @click="handleDelete(req.id)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <EditRequestModal
    v-if="editingRequest"
    :request="editingRequest"
    @close="editingRequest = null"
    @saved="editingRequest = null"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useVacationStore } from "../../stores/vacationStore";
import type { VacationRequest } from "../../types";
import StatusBadge from "../common/StatusBadge.vue";
import EmptyState from "../common/EmptyState.vue";
import EditRequestModal from "./EditRequestModal.vue";

const store = useVacationStore();
onMounted(() => store.loadMyRequests());

const editingRequest = ref<VacationRequest | null>(null);
const openEdit = (req: VacationRequest) => { editingRequest.value = req; };

const handleDelete = async (id: number) => {
  if (!confirm("Delete this vacation request?")) return;
  await store.deleteMyRequest(id);
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
</script>

<style scoped>
.btn-edit {
  background: none;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  padding: 3px 10px;
  font-size: 12px;
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.btn-edit:hover {
  background: var(--color-primary);
  color: #fff;
}
.btn-delete {
  background: none;
  border: 1px solid var(--color-danger);
  color: var(--color-danger);
  padding: 3px 10px;
  font-size: 12px;
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.btn-delete:hover {
  background: var(--color-danger);
  color: #fff;
}
</style>

