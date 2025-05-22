<template>
  <Transition name="rake-fade">
    <div v-if="isVisible" class="rake-modal-overlay">
      <div class="rake-modal">
        <div class="rake-icon">
          <i class="fas fa-coins"></i>
        </div>
        <div class="rake-text">
          <h2>Collecting Rake...</h2>
          <p v-if="amount">{{ amount }} credits</p>
        </div>
        <div class="rake-animation">
          <div class="coin coin-1"></div>
          <div class="coin coin-2"></div>
          <div class="coin coin-3"></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { TRANSITION_DELAY } from '@/const/game-constants'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  amount: {
    type: Number,
    default: null
  }
})


const emit = defineEmits(['hidden', 'shown'])
const isVisible = ref(props.show)
let timer: ReturnType<typeof setTimeout> | null = null 

// Watch for changes to the show prop
watch(() => props.show, (newVal) => {
  if (newVal) {
    showModal()
  } else {
    isVisible.value = false
  }
})

function showModal() {
  isVisible.value = true
  emit('shown') // Add this line to emit when modal shows
  
  // Auto-hide after TRANSITION_DELAY
  clearTimeout(timer as number)
  timer = setTimeout(() => {
    isVisible.value = false
    emit('hidden')
  }, TRANSITION_DELAY)
}

// Clean up timer when component is unmounted
onUnmounted(() => {
  clearTimeout(timer as number)
})
</script>

<style scoped>
.rake-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 16000;
}

.rake-modal {
  background-color: #222;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  text-align: center;
  max-width: 400px;
  width: 100%;
  border: 2px solid #ffd700;
  position: relative;
  overflow: hidden;
}

.rake-icon {
  font-size: 3rem;
  color: #ffd700;
  margin-bottom: 1rem;
  animation: pulse 1.5s infinite;
}

.rake-text h2 {
  color: #ffd700;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}

.rake-text p {
  color: #fff;
  font-size: 1.2rem;
}

/* Animation for coins */
.rake-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.coin {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: #ffd700;
  border-radius: 50%;
  opacity: 0.8;
}

.coin-1 {
  top: 20%;
  left: 10%;
  animation: coinFall 3s infinite ease-in;
  animation-delay: 0.2s;
}

.coin-2 {
  top: 10%;
  left: 50%;
  animation: coinFall 2.5s infinite ease-in;
  animation-delay: 0.5s;
}

.coin-3 {
  top: 15%;
  right: 15%;
  animation: coinFall 3.2s infinite ease-in;
  animation-delay: 0.8s;
}

@keyframes coinFall {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  20% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(300px);
    opacity: 0;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* Transition animations */
.rake-fade-enter-active,
.rake-fade-leave-active {
  transition: opacity 0.5s ease;
}

.rake-fade-enter-from,
.rake-fade-leave-to {
  opacity: 0;
}
</style>