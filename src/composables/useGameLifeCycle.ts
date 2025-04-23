/**
 * Composable for ending the game.
 *
 */

export function useGameLifeCycle() {
  const router = useRouter()

  const startNewGame = () => {
    localStorage.clear()
    router.push('/')
  }

  return {
    startNewGame,
  }
}

import { useRouter } from 'vue-router'
