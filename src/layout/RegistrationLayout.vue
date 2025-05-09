<!--
  Layout for all OUTSIDE views.
-->

<template>
  <div class="landing-container landing-gradient">
    <div class="overlay" />

    <router-view v-slot="{ Component }">
      <component :is="Component" :key="route.path" />
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useDynamicStyle } from '@/composables/utilities/useDynamicStyle'

// Use Route
const route = useRoute()

// Loads page's style
useDynamicStyle()
</script>

<style lang="css" scoped>
@media screen and (orientation: landscape) {
  .landing-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: auto;
    padding: 2rem 2.5rem;
  }

  .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* Centers the element */
    background-image: url('../assets/img/landing-assets/BG-Menu.png');
    background-size: cover;
    background-position: center;
    opacity: 0.07;
    background-size: contain;
  }
}
</style>
