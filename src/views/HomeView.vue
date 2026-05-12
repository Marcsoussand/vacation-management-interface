<template>
  <div class="home-layout">
    <!-- Left panel: user selection -->
    <div class="home-left">
      <div class="home-card-wrapper">
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

    <!-- Right panel: photo carousel -->
    <div class="home-right">
      <div
        v-for="(photo, i) in photos"
        :key="i"
        class="home-slide"
        :class="{ active: currentSlide === i }"
        :style="{ backgroundImage: `url(${photo})` }"
      />
      <!-- Dot indicators -->
      <div class="home-dots">
        <button
          v-for="(_, i) in photos"
          :key="i"
          class="home-dot"
          :class="{ active: currentSlide === i }"
          @click="currentSlide = i"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
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

// Carousel
const photos = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80", // beach
  "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&q=80",   // ski slope with skiers
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80", // mountain
];
const currentSlide = ref(0);
let interval: ReturnType<typeof setInterval>;

onMounted(() => {
  interval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % photos.length;
  }, 4000);
});

onUnmounted(() => clearInterval(interval));
</script>

<style scoped>
.home-layout {
  display: flex;
  min-height: 100vh;
}

/* Left panel */
.home-left {
  width: 420px;
  flex-shrink: 0;
  background: var(--sidebar-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;
}

.home-card-wrapper {
  width: 100%;
  max-width: 360px;
}

/* Right panel */
.home-right {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.home-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1s ease;
}

.home-slide.active {
  opacity: 1;
}

/* Dot indicators */
.home-dots {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.home-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.45);
  border: none;
  cursor: pointer;
  transition: background 0.3s;
}

.home-dot.active {
  background: #ffffff;
}

/* Hide photo panel on small screens */
@media (max-width: 768px) {
  .home-right {
    display: none;
  }
  .home-left {
    width: 100%;
  }
}
</style>

