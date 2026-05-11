<template>
  <nav class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
    <div class="flex items-center gap-3">
      <svg class="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      <span class="text-lg font-bold text-gray-800">Vacation Manager</span>
    </div>
    <div class="flex items-center gap-4">
      <span v-if="store.currentUser" class="text-sm text-gray-600">
        <span class="font-medium text-gray-800">{{ store.currentUser.name }}</span>
        &mdash;
        <span class="text-blue-600 font-medium">{{ store.currentUser.role }}</span>
      </span>
      <button
        @click="handleLogout"
        class="text-sm text-gray-500 hover:text-red-600 transition-colors"
      >
        Switch user
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useVacationStore } from "../../stores/vacationStore";

const store = useVacationStore();
const router = useRouter();

const handleLogout = () => {
  store.currentUser = null;
  router.push({ name: "home" });
};
</script>
