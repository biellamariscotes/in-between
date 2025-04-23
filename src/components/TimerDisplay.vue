<template>
  <div class="timer-container">
    <h2 :class="['timer', { warning: isWarning }]">Time: {{ formattedTime }}</h2>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = defineProps<{
  timeRemaining: number
  isActive: boolean
}>()

const formattedTime = computed(() => `${props.timeRemaining}s`)
const isWarning = computed(() => props.timeRemaining <= 3 && props.isActive)
</script>

<style scoped>
.timer {
  color: white;
  font-size: 1.5rem;
  transition: color 0.3s ease;
}

.timer.warning {
  color: #ff5252;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
