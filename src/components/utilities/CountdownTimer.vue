<!-- Timer Component -->

<template>
  <div id="btn6" class="circle" :class="{ 'time-warning': timeRunningLow }">
    <!-- Timer Container -->
    <div class="image-container">
      <img class="time-img" :src="getSvgSrc(gameStore.turnTimeRemaining)" alt="Timer Digit" />
      <div class="time-text">{{ formattedTimeRemaining }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Script setup section
import { ref, onMounted, computed, watch } from 'vue'
import { useGameStore } from '@/stores/game-store'
const gameStore = useGameStore()

// Modal visibility state
const showResultModal = ref(false)

// Maps numbers to SVG image paths for timer display
const numberSvgs: Record<number, string> = {
  0: '/src/assets/img/game-zone/timer/0.svg',
  1: '/src/assets/img/game-zone/timer/1.1.svg',
  2: '/src/assets/img/game-zone/timer/2.svg',
  3: '/src/assets/img/game-zone/timer/3.svg',
  4: '/src/assets/img/game-zone/timer/4.svg',
  5: '/src/assets/img/game-zone/timer/5.svg',
  6: '/src/assets/img/game-zone/timer/6.svg',
  7: '/src/assets/img/game-zone/timer/7.svg',
  8: '/src/assets/img/game-zone/timer/8.svg',
  9: '/src/assets/img/game-zone/timer/9.9.svg',
  10: '/src/assets/img/game-zone/timer/10.svg',
  11: '/src/assets/img/game-zone/timer/11.svg',
  12: '/src/assets/img/game-zone/timer/12.svg',
  13: '/src/assets/img/game-zone/timer/13.svg',
  14: '/src/assets/img/game-zone/timer/14.svg',
  15: '/src/assets/img/game-zone/timer/15.svg',
  16: '/src/assets/img/game-zone/timer/16.svg',
  17: '/src/assets/img/game-zone/timer/17.svg',
  18: '/src/assets/img/game-zone/timer/18.svg',
  19: '/src/assets/img/game-zone/timer/19.svg',
  20: '/src/assets/img/game-zone/timer/20.1.svg',
}

// Local timer state
const timeRemaining = ref(0)

/**
 * Returns appropriate SVG path based on time remaining
 */
const getSvgSrc = (number: number): string =>
  numberSvgs[number] || '/src/assets/img/game-zone/timer/20.svg'

/**
 * Displayed time text (currently empty)
 */
const formattedTimeRemaining = computed(() => {
  if (!gameStore.gameStarted || gameStore.gameOver) {
    return ''
  }
  return ``
})

/**
 * Determines when to apply warning style (≤ 3 seconds and timer active)
 */
const timeRunningLow = computed(() => {
  return gameStore.turnTimeRemaining <= 3 && gameStore.turnTimerActive
})

// ─────────────────────────────
// Watchers
// ─────────────────────────────

// Watch: for player changes to restart timer
watch(
  () => gameStore.currentPlayerIndex,
  () => {
    if (gameStore.gameStarted && !gameStore.gameOver && !showResultModal.value) {
      gameStore.startTurnTimer()
    }
  },
)

// ─────────────────────────────
// Hooks
// ─────────────────────────────

// Local timer countdown logic
onMounted(() => {
  const interval = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
    } else {
      clearInterval(interval)
    }
  }, 1000)
})
</script>

<style lang="css" scoped>
.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: rgb(8, 8, 8);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  position: relative;
}

.time-warning {
  background-color: #ff3333;
  box-shadow: 0px 0px 15px 5px rgba(255, 51, 51, 0.5);
}

.time-img {
  width: 75%;
  height: 75%;
  object-fit: contain;
  object-position: center;
}

.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.time-text {
  position: absolute;
  bottom: -25px;
  color: white;
  font-size: 14px;
  font-weight: bold;
}
</style>
