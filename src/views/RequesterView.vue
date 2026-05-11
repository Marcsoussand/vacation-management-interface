<template>
  <AppLayout title="My Vacation Requests">
    <!-- Stats row -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="ibox" style="margin:0">
        <div class="ibox-content flex items-center gap-4 py-4">
          <div class="w-12 h-12 rounded flex items-center justify-center" style="background: var(--color-warning)">
            <svg class="w-6 h-6 text-white" fill="none" stroke="white" viewBox="0 0 24 24">
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

    <VacationForm />
    <RequestList />
  </AppLayout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useVacationStore } from "../stores/vacationStore";
import AppLayout from "../components/common/AppLayout.vue";
import VacationForm from "../components/requester/VacationForm.vue";
import RequestList from "../components/requester/RequestList.vue";

const store = useVacationStore();
const counts = computed(() => ({
  Pending: store.requests.filter((r) => r.status === "Pending").length,
  Approved: store.requests.filter((r) => r.status === "Approved").length,
  Rejected: store.requests.filter((r) => r.status === "Rejected").length,
}));
</script>
