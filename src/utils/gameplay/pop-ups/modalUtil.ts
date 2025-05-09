import { ref } from 'vue'
import { useGameStore } from '@/stores/game-store'
import YouWinImage from '@/assets/img/outcomes/you-win.png'
import YouLoseImage from '@/assets/img/outcomes/you-lose.png'
import YouFoldImage from '@/assets/img/outcomes/you-fold.png'
import YouWinSound from '@/assets/sfx/voices/you-win.wav'
import YouLoseSound from '@/assets/sfx/voices/you-lose.wav'
import YouFoldSound from '@/assets/sfx/outcomes/lose_1.wav'
import PenaltyFoldImage from '@/assets/img/OUTCOMES/penalty-fold.png'

const youWinSound = new Audio(YouWinSound)
const youLoseSound = new Audio(YouLoseSound)
const youFoldSound = new Audio(YouFoldSound)

export const showResultModal = ref(false)
export const resultModalImage = ref('')
export const modalType = ref<'win' | 'lose' | 'fold' | 'penalty-fold' | ''>('')

// Time to display modal before hiding it
const MODAL_DISPLAY_TIME = 2000 // 2 seconds

/**
 * Shows a modal with the specified image for a fixed duration
 * @param image The image to display in the modal
 * @param type The type of modal ('win', 'lose', 'fold', or 'penalty-fold')
 */
function showModal(image: string, type: 'win' | 'lose' | 'fold' | 'penalty-fold') {
  resultModalImage.value = image
  modalType.value = type
  showResultModal.value = true

  // Hide modal after delay
  setTimeout(() => {
    showResultModal.value = false
    modalType.value = ''
  }, MODAL_DISPLAY_TIME)
}

// Specific modal display functions
export function showWinModal() {
  const gameStore = useGameStore()

  // Stop the turn timer while showing result
  gameStore.stopTurnTimer()

  showModal(YouWinImage, 'win')
  // Play the win sound
  youWinSound.currentTime = 0 // Reset the sound to the beginning
  youWinSound.play().catch((error) => {
    console.error('Error playing sound:', error)
  })

  // Auto-close after 2 seconds and only then process the next turn
  setTimeout(() => {
    if (gameStore.isMultiplayer && gameStore.gameStarted && !gameStore.gameOver) {
      setTimeout(() => {
        gameStore.startTurnTimer()
      }, 500)
    }
  }, MODAL_DISPLAY_TIME)
}

export function showLoseModal() {
  const gameStore = useGameStore()

  // Stop the turn timer while showing result
  gameStore.stopTurnTimer()

  showModal(YouLoseImage, 'lose')
  // Play the lose sound
  youLoseSound.currentTime = 0 // Reset the sound to the beginning
  youLoseSound.play().catch((error) => {
    console.error('Error playing sound:', error)
  })

  // Auto-close after 2 seconds and only then process the next turn
  setTimeout(() => {
    if (gameStore.isMultiplayer && gameStore.gameStarted && !gameStore.gameOver) {
      setTimeout(() => {
        gameStore.startTurnTimer()
      }, 500)
    }
  }, MODAL_DISPLAY_TIME)
}

export function showFoldModal() {
  const gameStore = useGameStore()

  // Stop the turn timer while showing result
  gameStore.stopTurnTimer()

  showModal(YouFoldImage, 'fold')
  // Play the fold sound
  youFoldSound.currentTime = 0 // Reset the sound to the beginning
  youFoldSound.play().catch((error) => {
    console.error('Error playing sound:', error)
  })
  // Auto-close after 2 seconds and only then process the next turn
  setTimeout(() => {
    if (gameStore.isMultiplayer && gameStore.gameStarted && !gameStore.gameOver) {
      // Wait a bit more before moving to next player
      setTimeout(() => {
        // Ensure the next player's turn timer doesn't start until modal is gone
        gameStore.startTurnTimer()
      }, 500)
    }
  }, MODAL_DISPLAY_TIME)
}

export function showPenaltyFoldModal() {
  const gameStore = useGameStore()

  gameStore.stopTurnTimer()

  resultModalImage.value = PenaltyFoldImage
  modalType.value = 'penalty-fold'
  showResultModal.value = true

  setTimeout(() => {
    showResultModal.value = false
    modalType.value = ''

    // Auto-close after delay and only then process the next turn
    if (gameStore.isMultiplayer && gameStore.gameStarted && !gameStore.gameOver) {
      setTimeout(() => {
        gameStore.startTurnTimer()
      }, 500)
    }
  }, MODAL_DISPLAY_TIME)
}
