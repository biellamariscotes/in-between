/**
 * Composable to handle tax collection on all-in wins
 * This is used to integrate with the game flow
 */
import { useTaxStore } from '@/stores/tax-store'
import { useGameStore } from '@/stores/game-store'
import { storeToRefs } from 'pinia'

export function useTaxation() {
  const taxStore = useTaxStore()
  const gameStore = useGameStore()

  // Initialize tax store if not already initialized
  if (!taxStore.initialized) {
    taxStore.initialize()
  }

  // Get reactive references to store values
  const { roundsPlayed } = storeToRefs(gameStore)
  const { totalTaxCollected, taxRate, taxHistory } = storeToRefs(taxStore)

  /**
   * Process tax for a winning player
   * @param playerId - ID of the player who won
   * @param winAmount - The amount won before tax
   * @param isAllIn - Whether the win was from an all-in bet
   * @returns The tax amount collected (winAmount will need to be reduced by this amount)
   */
  const processTax = (
    playerId: string | number | undefined,
    winAmount: number,
    isAllIn: boolean,
  ): number => {
    if (!isAllIn || winAmount <= 0) {
      return 0
    }
    // Collect tax and return the tax amount
    return taxStore.collectTax(playerId, winAmount, roundsPlayed.value)
  }

  /**
   * Calculate the after-tax win amount
   * @param winAmount - The original win amount
   * @param isAllIn - Whether this was an all-in win
   * @returns The win amount minus tax if applicable
   */
  const calculateAfterTaxWin = (winAmount: number, isAllIn: boolean): number => {
    if (!isAllIn || winAmount <= 0) {
      return winAmount
    }
    // Calculate tax amount (using reactive taxRate)
    const taxAmount = Math.round(winAmount * taxRate.value * 100) / 100
    // Return win amount after tax
    return winAmount - taxAmount
  }

  /**
   * Get tax statistics for display
   */
  const getTaxStats = () => {
    return taxStore.getTaxStats
  }

  /**
   * Get recent tax events
   */
  const getRecentTaxEvents = (count = 5) => {
    return taxStore.getRecentTaxEvents(count)
  }

  /**
   * Get tax metrics by player
   */
  const getTaxByPlayer = () => {
    return taxStore.getTaxByPlayer
  }

  /**
   * Reset all tax data
   */
  const resetTaxData = () => {
    taxStore.resetTax()
  }

  return {
    processTax,
    calculateAfterTaxWin,
    getTaxStats,
    getRecentTaxEvents,
    getTaxByPlayer,
    resetTaxData,
    totalTaxCollected, // Return reactive reference
    taxRate: taxStore.getTaxRate, // Using getter for consistency with current code
    taxHistory, // Return reactive reference
  }
}
