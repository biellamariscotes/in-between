/**
 * Composable for turns reactivity.
 *
 * Documentation: docs/composables/usePlayerRandomizer.md
 *
 */

import { computed } from 'vue'
import { usePlayerOrderStore } from '@/stores/player-sequence'
import { usePlayerRegistration } from '@/stores/player'
import type { Player } from '@/interface/player'

export function usePlayerRandomizer() {
  const orderStore = usePlayerOrderStore()
  const playerStore = usePlayerRegistration()

  // Load from storage once when used
  playerStore.loadPlayersFromStorage()
  orderStore.loadSavedOrder()

  // ─────────────────────────────
  // Reactive Data
  // ─────────────────────────────

  const orderedPlayers = computed(() => orderStore.orderedPlayers)
  const isOrdered = computed(() => orderStore.isOrdered)

  // ─────────────────────────────
  // Randomization Logic
  // ─────────────────────────────

  const randomizePlayers = () => {
    orderStore.randomizeOrder()
  }

  const resetPlayerOrder = () => {
    orderStore.resetOrder()
  }

  // ─────────────────────────────
  // Turn Logic
  // ─────────────────────────────

  const getCurrentPlayer = (currentTurn: number): Player | undefined => {
    if (orderedPlayers.value.length === 0) return undefined
    const normalizedTurn = (currentTurn - 1) % orderedPlayers.value.length
    return orderedPlayers.value[normalizedTurn]
  }

  const getNextPlayer = (currentPlayerId: string | number): Player | undefined => {
    const index = orderedPlayers.value.findIndex((p) => p.id === currentPlayerId)
    if (index === -1) return undefined
    const nextIndex = (index + 1) % orderedPlayers.value.length
    return orderedPlayers.value[nextIndex]
  }

  // ─────────────────────────────
  // Expose API
  // ─────────────────────────────

  return {
    orderedPlayers,
    isOrdered,
    randomizePlayers,
    resetPlayerOrder,
    getCurrentPlayer,
    getNextPlayer,
  }
}
