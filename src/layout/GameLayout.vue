<!--
  Layout for all GAME view.
-->

<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" :key="route.path" />
  </router-view>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useDynamicStyle } from '@/composables/utilities/useDynamicStyle'

// Use Route
const route = useRoute()

// Loads page's style
useDynamicStyle()
</script>
