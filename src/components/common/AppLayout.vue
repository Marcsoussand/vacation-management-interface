<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <nav
      class="flex-shrink-0 flex flex-col"
      :style="{ width: '220px', background: 'var(--sidebar-bg)' }"
    >
      <!-- Logo -->
      <div class="flex items-center gap-2 px-5 py-4 border-b border-white/10">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="text-white font-bold text-sm tracking-wide">VACATION MGR</span>
      </div>

      <!-- User info -->
      <div class="px-5 py-4 border-b border-white/10">
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
            :style="{ background: 'var(--sidebar-active-border)', color: '#fff' }"
          >
            {{ initials }}
          </div>
          <div>
            <p class="text-white text-xs font-semibold leading-tight">{{ store.currentUser?.name }}</p>
            <p class="text-xs mt-0.5" :style="{ color: 'var(--sidebar-text)' }">{{ store.currentUser?.role }}</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <ul class="sidebar-nav flex-1 mt-2 list-none p-0">
        <li>
          <RouterLink to="/" class="sidebar-nav-link" activeClass="active">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </RouterLink>
        </li>
        <li v-if="store.currentUser?.role === 'Requester'">
          <RouterLink to="/requester" class="sidebar-nav-link" activeClass="active">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            My Requests
          </RouterLink>
        </li>
        <li v-if="store.currentUser?.role === 'Validator'">
          <RouterLink to="/validator" class="sidebar-nav-link" activeClass="active">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Dashboard
          </RouterLink>
        </li>
      </ul>

      <!-- Logout -->
      <div class="p-4 border-t border-white/10">
        <button
          @click="handleLogout"
          class="w-full text-left flex items-center gap-2 text-xs py-2 px-2 rounded transition-colors"
          :style="{ color: 'var(--sidebar-text)' }"
          style="background: transparent; border: none; cursor: pointer;"
          onmouseover="this.style.color='#fff'"
          onmouseout="this.style.color='var(--sidebar-text)'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Switch user
        </button>
      </div>
    </nav>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top navbar -->
      <header
        class="flex items-center justify-between px-6 py-3 border-b"
        :style="{ background: 'var(--navbar-bg)', borderColor: 'var(--panel-border)', minHeight: '56px' }"
      >
        <div>
          <h1 class="text-sm font-semibold" :style="{ color: 'var(--text-heading)' }">{{ title }}</h1>
          <p class="text-xs mt-0.5" :style="{ color: 'var(--sidebar-text)' }">
            <RouterLink to="/" class="hover:underline" style="color: inherit">Home</RouterLink>
            <span class="mx-1">/</span>
            <span>{{ title }}</span>
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs" :style="{ color: 'var(--text-primary)' }">
            Welcome, <strong>{{ store.currentUser?.name }}</strong>
          </span>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-6" :style="{ background: 'var(--body-bg)' }">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useVacationStore } from "../../stores/vacationStore";

defineProps<{ title: string }>();

const store = useVacationStore();
const router = useRouter();

const initials = computed(() =>
  (store.currentUser?.name ?? "")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
);

const handleLogout = () => {
  store.currentUser = null;
  router.push({ name: "home" });
};
</script>

<style scoped>
.sidebar-nav-link {
  color: var(--sidebar-text);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 13px;
  transition: background 0.15s, color 0.15s;
  border-left: 4px solid transparent;
  text-decoration: none;
}
.sidebar-nav-link:hover {
  background: var(--sidebar-hover-bg);
  color: #fff;
}
.sidebar-nav-link.active {
  color: #fff;
  border-left-color: var(--sidebar-active-border);
  background: var(--sidebar-hover-bg);
}
</style>
