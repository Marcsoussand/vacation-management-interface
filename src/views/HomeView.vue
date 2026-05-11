<template>
  <div class="min-h-screen flex items-center justify-center" style="background: var(--sidebar-bg)">
    <div style="width: 100%; max-width: 380px">
      <!-- Logo block -->
      <div class="text-center mb-6">
        <svg class="mx-auto w-12 h-12 mb-3" fill="none" stroke="white" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h1 class="text-white text-2xl font-bold tracking-wide">VACATION MANAGER</h1>
        <p class="text-xs mt-1" style="color: var(--sidebar-text)">Select your profile to continue</p>
      </div>

      <!-- User selection panel -->
      <div class="ibox" style="margin: 0">
        <div class="ibox-title">
          <h5>Who are you?</h5>
        </div>
        <div class="ibox-content">
          <div v-if="store.loading" class="text-center py-4 text-sm" style="color: var(--sidebar-text)">Loading...</div>
          <div v-else-if="store.error" class="text-sm" style="color: var(--color-danger)">{{ store.error }}</div>
          <div v-else class="space-y-2">
            <button
              v-for="user in store.users"
              :key="user.id"
              @click="selectUser(user)"
              class="w-full flex items-center justify-between px-4 py-3 border rounded transition-colors"
              style="background: #fff; border-color: var(--panel-border); cursor: pointer"
              onmouseover="this.style.borderColor='var(--color-primary)'"
              onmouseout="this.style.borderColor='var(--panel-border)'"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  :style="{ background: user.role === 'Validator' ? 'var(--color-primary)' : 'var(--color-success)' }"
                >
                  {{ initials(user.name) }}
                </div>
                <span class="text-sm font-semibold" style="color: var(--text-heading)">{{ user.name }}</span>
              </div>
              <span
                class="text-xs font-semibold px-2 py-1 rounded"
                :style="user.role === 'Validator'
                  ? 'background: #e8f4fd; color: var(--color-primary)'
                  : 'background: #e6f7f4; color: var(--color-success)'"
              >
                {{ user.role }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useVacationStore } from "../stores/vacationStore";
import type { User } from "../types";

const store = useVacationStore();
const router = useRouter();

onMounted(() => store.loadUsers());

const selectUser = (user: User) => {
  store.setCurrentUser(user);
  router.push({ name: user.role === "Validator" ? "validator" : "requester" });
};

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
</script>
