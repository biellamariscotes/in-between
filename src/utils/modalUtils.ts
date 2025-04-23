import { ref } from 'vue'
import { useGameStore } from '@/stores/game-store'
import YouWinImage from '@/assets/img/game-zone/you-win.png'
import YouLoseImage from '@/assets/img/game-zone/you-lose.png'
import YouFoldImage from '@/assets/img/game-zone/you-fold.png'
export const showResultModal = ref(false)
export const resultModalImage = ref('')

/**
 * Show fold modal and handle timer logic
 */
export function showFoldModal() {
  const gameStore = useGameStore()

  // Stop the turn timer while showing result
  gameStore.stopTurnTimer()

  resultModalImage.value = YouFoldImage
  showResultModal.value = true

  // Auto-close after 2 seconds and only then process the next turn
  setTimeout(() => {
    showResultModal.value = false
    // Only restart the game flow after the modal has closed
    if (gameStore.isMultiplayer && gameStore.gameStarted && !gameStore.gameOver) {
      // Wait a bit more before moving to next player
      setTimeout(() => {
        // Ensure the next player's turn timer doesn't start until modal is gone
        gameStore.startTurnTimer()
      }, 500)
    }
  }, 2000)
}

/**
 * Show win modal and handle timer logic
 */
export function showWinModal() {
  const gameStore = useGameStore()

  // Stop the turn timer while showing result
  gameStore.stopTurnTimer()

  resultModalImage.value = YouWinImage
  showResultModal.value = true

  // Auto-close after 2 seconds and only then process the next turn
  setTimeout(() => {
    showResultModal.value = false
    if (gameStore.isMultiplayer && gameStore.gameStarted && !gameStore.gameOver) {
      setTimeout(() => {
        gameStore.startTurnTimer()
      }, 500)
    }
  }, 2000)
}

/**
 * Show lose modal and handle timer logic
 */
export function showLoseModal() {
  const gameStore = useGameStore()

  // Stop the turn timer while showing result
  gameStore.stopTurnTimer()

  resultModalImage.value = YouLoseImage
  showResultModal.value = true

  // Auto-close after 2 seconds and only then process the next turn
  setTimeout(() => {
    showResultModal.value = false
    if (gameStore.isMultiplayer && gameStore.gameStarted && !gameStore.gameOver) {
      setTimeout(() => {
        gameStore.startTurnTimer()
      }, 500)
    }
  }, 2000)
}
