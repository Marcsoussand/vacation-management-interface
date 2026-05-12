<template>
  <AppLayout title="Vacation Requests Dashboard">
    <!-- Stats row -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="ibox" style="margin:0">
        <div class="ibox-content flex items-center gap-4 py-4">
          <div class="w-12 h-12 rounded flex items-center justify-center" style="background: var(--color-warning)">
            <svg class="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold" style="color: var(--text-heading)">{{ counts.Pending }}</p>
            <p class="text-xs" style="color: var(--sidebar-text)">Pending</p>
          </div>
        </div>
      </div>
      <div class="ibox" style="margin:0">
        <div class="ibox-content flex items-center gap-4 py-4">
          <div class="w-12 h-12 rounded flex items-center justify-center" style="background: var(--color-success)">
            <svg class="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold" style="color: var(--text-heading)">{{ counts.Approved }}</p>
            <p class="text-xs" style="color: var(--sidebar-text)">Approved</p>
          </div>
        </div>
      </div>
      <div class="ibox" style="margin:0">
        <div class="ibox-content flex items-center gap-4 py-4">
          <div class="w-12 h-12 rounded flex items-center justify-center" style="background: var(--color-danger)">
            <svg class="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold" style="color: var(--text-heading)">{{ counts.Rejected }}</p>
            <p class="text-xs" style="color: var(--sidebar-text)">Rejected</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Table panel -->
    <div class="ibox">
      <div class="ibox-title" style="display: flex; align-items: center; justify-content: space-between">
        <h5>All Requests</h5>
        <div class="flex items-center gap-3">
          <select v-model="selectedUserId" class="form-control" style="width: auto; min-width: 150px; font-size: 13px; height: 32px; padding: 0 8px">
            <option :value="null">All employees</option>
            <option v-for="u in requesterUsers" :key="u.id" :value="u.id">{{ u.name }}</option>
          </select>
          <FilterBar :model-value="activeFilter" @change="handleFilterChange" />
        </div>
      </div>
      <div class="ibox-content" style="padding: 0">
        <RequestTable :requests="filteredRequests" @approve="handleApprove" @reject="openRejectModal" />
      </div>
    </div>

    <p v-if="store.error" class="text-sm mt-2" style="color: var(--color-danger)">{{ store.error }}</p>

    <RejectModal
      v-if="rejectTargetId !== null"
      @confirm="handleReject"
      @cancel="rejectTargetId = null"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useVacationStore } from "../stores/vacationStore";
import type { RequestStatus } from "../types";
import AppLayout from "../components/common/AppLayout.vue";
import FilterBar from "../components/validator/FilterBar.vue";
import RequestTable from "../components/validator/RequestTable.vue";
import RejectModal from "../components/validator/RejectModal.vue";

const store = useVacationStore();
const activeFilter = ref<RequestStatus | "All">("All");
const rejectTargetId = ref<number | null>(null);

const selectedUserId = ref<number | null>(null);

onMounted(() => {
  store.loadAllRequests();
  if (store.users.length === 0) store.loadUsers();
});

const requesterUsers = computed(() =>
  store.users.filter((u) => u.role === "Requester")
);

const filteredRequests = computed(() =>
  selectedUserId.value === null
    ? store.requests
    : store.requests.filter((r) => r.userId === selectedUserId.value)
);

const counts = computed(() => ({
  Pending: store.requests.filter((r) => r.status === "Pending").length,
  Approved: store.requests.filter((r) => r.status === "Approved").length,
  Rejected: store.requests.filter((r) => r.status === "Rejected").length,
}));

const handleFilterChange = (value: RequestStatus | "All") => {
  activeFilter.value = value;
  store.loadAllRequests(value === "All" ? undefined : value);
};

const handleApprove = async (id: number) => {
  await store.approve(id);
};

const openRejectModal = (id: number) => {
  rejectTargetId.value = id;
};

const handleReject = async (comment: string) => {
  if (rejectTargetId.value === null) return;
  await store.reject(rejectTargetId.value, comment);
  rejectTargetId.value = null;
};
</script>
