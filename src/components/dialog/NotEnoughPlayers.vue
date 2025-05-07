<template>
  <div v-if="isVisible" class="game-over-modal">
    <div class="modal-content">
      <img
        src="@/assets/img/buttons/actions/game-over-1.png"
        alt="Game Over"
        class="game-over-image"
      />

      <h1 class="gameover-feedback">Remaining Pot Goes to Banker</h1>

      <div class="button-container">
        <button class="game-button new-game-btn" @click="handleNewGame">Start New Game</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGameLifeCycle } from '@/composables/game/useGameLifeCycle'
import { useGameStore } from '@/stores/game-store'

const gameStore = useGameStore()
const { startNewGame } = useGameLifeCycle()

defineProps<{
  message?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isVisible = ref(true)

const handleNewGame = () => {
  startNewGame()
  gameStore.resetGame()
  isVisible.value = false
  emit('close')
}
</script>

<style scoped>
.game-over-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  position: relative;
  top: -10px;
  max-width: 90%;
  text-align: center;
}

.game-over-image {
  max-width: 50%;
  height: auto;
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  flex-direction: row;
  gap: 20px;
  margin-top: 40px;
}

.game-button {
  background: linear-gradient(to bottom, #ffd700, #b8860b);
  border: 2px solid #a67c00;
  color: #000;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 180px;
}

.game-button:hover {
  transform: scale(1.05);
  background: linear-gradient(to bottom, #ffef00, #ffd700);
}

.new-game-btn {
  background: linear-gradient(to bottom, #4caf50, #2e7d32);
  border-color: #1b5e20;
  color: white;
}

.new-game-btn:hover {
  background: linear-gradient(to bottom, #66bb6a, #4caf50);
}

.reshuffle-btn {
  background: linear-gradient(to bottom, #2196f3, #0d47a1);
  border-color: #0a3880;
  color: white;
}

.reshuffle-btn:hover {
  background: linear-gradient(to bottom, #42a5f5, #2196f3);
}

.gameover-feedback {
  color: white;
  letter-spacing: 3px;
}
</style>
