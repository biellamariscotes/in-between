import { ref } from 'vue'
import { useGameStore } from '@/stores/game-store'
import YouWinImage from '@/assets/img/outcomes/you-win.png'
import YouLoseImage from '@/assets/img/outcomes/you-lose.png'
import YouFoldImage from '@/assets/img/outcomes/you-fold.png'
import YouWinSound from '@/assets/sfx/voices/you-win.wav'
import YouLoseSound from '@/assets/sfx/voices/you-lose.wav'
import YouFoldSound from '@/assets/sfx/outcomes/lose_1.wav'
const youWinSound = new Audio(YouWinSound)
const youLoseSound = new Audio(YouLoseSound)
const youFoldSound = new Audio(YouFoldSound)

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
  // Play the fold sound
  youFoldSound.currentTime = 0 // Reset the sound to the beginning
  youFoldSound.play().catch((error) => {
    console.error('Error playing sound:', error)
  })
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
  // Play the win sound
  youWinSound.currentTime = 0 // Reset the sound to the beginning
  youWinSound.play().catch((error) => {
    console.error('Error playing sound:', error)
  })

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
  // Play the lose sound
  youLoseSound.currentTime = 0 // Reset the sound to the beginning
  youLoseSound.play().catch((error) => {
    console.error('Error playing sound:', error)
  })

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
