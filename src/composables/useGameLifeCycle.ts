/**
 * Composable for ending the game.
 *
 */

import { useGameStore } from '@/stores/game-store'

export function useGameLifeCycle() {
  const router = useRouter()
  const gameStore = useGameStore()

  const startNewGame = () => {
    localStorage.clear()
    gameStore.resetGame()
    router.push('/')
  }

  return {
    startNewGame,
  }
}

import { useRouter } from 'vue-router'
