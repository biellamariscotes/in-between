import { usePlayerOrderStore } from '@/stores/player-sequence'
import { usePlayerRegistration } from '@/stores/player'
import type { Player } from '@/interface/player'

export function usePlayerRandomizer() {
  const orderStore = usePlayerOrderStore()
  const playerStore = usePlayerRegistration()

  // Load players and saved order
  playerStore.loadPlayersFromStorage()
  orderStore.loadSavedOrder()

  /**
   * Randomize the order of players and return the ordered list
   * @returns Array of players with randomized order property
   */
  const randomizePlayers = (): Player[] => {
    console.log('📋 Players before randomizing:', playerStore.players)
    orderStore.randomizeOrder()
    console.log('🎯 Ordered Players after randomize:', orderStore.orderedPlayers)
    return orderStore.orderedPlayers
  }

  /**
   * Get the current player whose turn it is
   * @param currentTurn - The current turn number
   * @returns The player whose turn it is
   */
  const getCurrentPlayer = (currentTurn: number): Player | undefined => {
    const players = orderStore.orderedPlayers
    if (players.length === 0) return undefined

    // Calculate the player index based on turn number
    const normalizedTurn = (currentTurn - 1) % players.length
    return players[normalizedTurn]
  }

  /**
   * Get the next player in the turn order
   * @param currentPlayerId - The ID of the current player
   * @returns The next player in sequence
   */
  const getNextPlayer = (currentPlayerId: string | number): Player | undefined => {
    const players = orderStore.orderedPlayers
    if (players.length === 0) return undefined

    const currentIndex = players.findIndex((p) => p.id === currentPlayerId)
    if (currentIndex === -1) return undefined

    const nextIndex = (currentIndex + 1) % players.length
    return players[nextIndex]
  }

  return {
    randomizePlayers,
    getCurrentPlayer,
    getNextPlayer,
    resetPlayerOrder: orderStore.resetOrder,
    arePlayersOrdered: () => orderStore.isOrdered,
    orderedPlayers: orderStore.orderedPlayers,
  }
}
