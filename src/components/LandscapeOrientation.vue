<template>
  <div>
    <div v-if="isLandscape">
      <!-- Game content goes here -->
      <h1>Welcome to the Game!</h1>
    </div>
    <div v-else class="rotate-message">
      <h2>Please rotate your device for better experience</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

const isLandscape = ref(window.innerWidth > window.innerHeight)

const handleOrientationChange = () => {
  isLandscape.value = window.innerWidth > window.innerHeight
}

window.addEventListener('resize', handleOrientationChange)

onUnmounted(() => {
  window.removeEventListener('resize', handleOrientationChange)
})

// Watch for screen orientation changes
watch(isLandscape, (newValue) => {
  if (!newValue) {
    // Show a message or redirect to a different page
    alert('Please rotate your device for better experience')
  }
})
</script>

<style scoped>
.rotate-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background-color: #f0f0f0;
}

.rotate-image {
  width: 150px;
  height: auto;
  margin-bottom: 20px;
}

h2 {
  font-size: 1.5rem;
  color: #333;
}
</style>
