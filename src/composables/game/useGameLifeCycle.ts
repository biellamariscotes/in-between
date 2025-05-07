/**
 * Managing the game lifecycle.
 *
 * @returns {Object} - An object containing the `startNewGame` function.
 */

import { useGameStore } from '@/stores/game-store'
import { useGameHistory } from './useGameHistory'
import { useRouter } from 'vue-router'

export function useGameLifeCycle() {
  const router = useRouter()
  const gameStore = useGameStore()
  const gameHistoryStore = useGameHistory()

  // ─────────────────────────────
  // Game Logic
  // ─────────────────────────────

  const startNewGame = () => {
    const keysToRemove = ['currentCard', 'gameHistory', 'gameState', 'playerCount', 'players']
    keysToRemove.forEach((key) => localStorage.removeItem(key))
    gameStore.resetGame()
    gameHistoryStore.clearHistory()
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
