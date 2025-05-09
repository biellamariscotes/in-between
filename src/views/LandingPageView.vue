<template>
  <div class="landing-container landing-gradient">
    <div class="logo-container">
      <img src="../assets/img/landing-assets/in-between-logo.png" alt="logo" class="logo" />
      <img
        src="../assets/img/landing-assets/clip-path-group.png"
        alt="logo"
        class="start"
        @click="redirectToRoute"
      />
      <img src="../assets/img/landing-assets/Group-26.png" alt="logo" class="cards" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// ─────────────────────────────
// Route Redirection
// ─────────────────────────────

function redirectToRoute() {
  router.push('/choose-player')
}
</script>

<style>
.overlay {
  z-index: 1;
}
</style>
