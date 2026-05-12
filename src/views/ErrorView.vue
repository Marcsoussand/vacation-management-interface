<template>
  <div class="error-page">
    <div class="error-card">
      <div class="skier-wrap">
        <span class="skier">⛷️</span>
        <span class="snow">❄️ ❄️ ❄️</span>
      </div>
      <h1 class="error-title">Sorry, we missed the turn.</h1>
      <p class="error-subtitle">
        This page has gone completely off-piste.<br />
        Don't worry — even the best skiers wipe out sometimes.
      </p>
      <router-link to="/" class="btn-home">↩ Back to Safety</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// No logic needed — static error page
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2F4050 0%, #1a2a38 100%);
}

.error-card {
  text-align: center;
  padding: 48px 64px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 480px;
  width: 90%;
}

.skier-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.skier {
  font-size: 72px;
  display: inline-block;
  transform: rotate(100deg) scaleX(-1);
  filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.15));
}

.snow {
  font-size: 20px;
  margin-top: 8px;
  letter-spacing: 6px;
  opacity: 0.7;
}

.error-title {
  font-size: 24px;
  font-weight: 700;
  color: #2F4050;
  margin: 0 0 12px;
}

.error-subtitle {
  font-size: 14px;
  color: #888;
  line-height: 1.7;
  margin: 0 0 32px;
}

.btn-home {
  display: inline-block;
  padding: 10px 28px;
  background: #1c84c6;
  color: #fff;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}

.btn-home:hover {
  background: #1a6fa8;
}
</style>
