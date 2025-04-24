<template>
  <div v-if="show" class="result-modal">
    <div class="modal-content">
      <img :src="image" alt="Game Result" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{
  show: boolean
  image: string
}>()
</script>

<style scoped>
.result-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 16000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  width: 80%;
  animation: scaleIn 0.4s ease;
  z-index: 16000;
}

.modal-content img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.5);
  }
  to {
    transform: scale(1);
  }
}
</style>
