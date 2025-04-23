import { computed } from 'vue'
import { usePlayerStore } from '@/stores/player-count'
import { useGameStore } from '@/stores/game-store'
import { cardToDisplayId } from './cardUtils'

/**
 * Check if a player position is the current player
 */
export function isCurrentPlayer(playerIndex: number): boolean {
  const gameStore = useGameStore()
  return playerIndex === gameStore.currentPlayerIndex
}

/**
 * Generate active players array based on player count
 */
export function getActivePlayers(playerCount: number) {
  const active = Array(6).fill(false)

  // Fill active slots based on player count
  for (let i = 0; i < Math.min(playerCount, 6); i++) {
    active[i] = true
  }

  return active
}

/**
 * Calculate player cards based on game state
 */
export function calculatePlayerCards() {
  const gameStore = useGameStore()
  const playerStore = usePlayerStore()

  return computed(() => {
    const cards: string[][] = Array(6)
      .fill(0)
      .map(() => [])

    if (gameStore.gameStarted) {
      const currentPlayerIdx = gameStore.currentPlayerIndex

      // Show the left card
      if (gameStore.faceUpCards[0]) {
        cards[currentPlayerIdx][0] = cardToDisplayId(gameStore.faceUpCards[0])
      }

      // For middle card - only show if the player has drawn it this turn
      const isCurrentCardDrawnByCurrentPlayer =
        gameStore.currentCard !== null && gameStore.currentBet === 0 && gameStore.roundsPlayed > 0

      if (isCurrentCardDrawnByCurrentPlayer) {
        cards[currentPlayerIdx][1] = cardToDisplayId(gameStore.currentCard)
      } else {
        // Otherwise keep middle position hidden
        cards[currentPlayerIdx][1] = 'back'
      }

      // Show the right card
      if (gameStore.faceUpCards[1]) {
        cards[currentPlayerIdx][2] = cardToDisplayId(gameStore.faceUpCards[1])
      }

      // For other players, just show face-down cards
      for (let i = 0; i < (playerStore.playerCount ?? 0); i++) {
        if (i !== currentPlayerIdx) {
          cards[i] = ['back', 'back', 'back']
        }
      }
    } else {
      // Before game starts, all players have face-down cards
      for (let i = 0; i < (playerStore.playerCount ?? 0); i++) {
        cards[i] = ['back', 'back', 'back']
      }
    }

    return cards
  })
}
