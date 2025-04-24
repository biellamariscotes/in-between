/**
 * Composable for managing the game lifecycle.
 *
 * @returns {Object} - An object containing the `startNewGame` function.
 */

import { useGameStore } from '@/stores/game-store'
import { useRouter } from 'vue-router'

export function useGameLifeCycle() {
  const router = useRouter()
  const gameStore = useGameStore()

  const startNewGame = () => {
    localStorage.clear()
    gameStore.resetGame()
    router.push('/')
  }

  const reshuffleDeck = () => {
    gameStore.reshuffleDeck()
  }

  return {
    startNewGame,
    reshuffleDeck,
  }
}
