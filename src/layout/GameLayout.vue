<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" :key="route.path" />
  </router-view>
</template>

<script setup lang="ts">
import { onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

type StyleFile = 'gameZone.css'

// Function: Changes style file according to the set style in router
const loadStyle = (styleFile: StyleFile) => {
  // Remove any existing dynamic style
  const existingStyle = document.getElementById('dynamic-style')
  if (existingStyle) {
    existingStyle.remove()
  }

  if (styleFile) {
    const link = document.createElement('link')
    link.id = 'dynamic-style'
    link.rel = 'stylesheet'
    link.href = `/src/assets/styles/${styleFile}`
    document.head.appendChild(link)
  }
}

// Watch: Route changes and load the corresponding style
const stopWatch = watch(
  () => route.meta?.style as StyleFile | undefined, // assertion: meta.style is of type StyleFile or undefined
  (newStyle: StyleFile | undefined) => {
    if (newStyle) {
      loadStyle(newStyle)
    }
  },
  { immediate: true },
)

// Cleanup watch on component unmount
onUnmounted(() => {
  stopWatch()
})
</script>

<style lang="css" scoped></style>
