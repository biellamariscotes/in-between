import { useTaxStore } from '@/stores/tax-store'
import { useGameStore } from '@/stores/game-store'
import { computed } from 'vue'

export function useTaxation() {
  const taxStore = useTaxStore()
  const gameStore = useGameStore()

  // Get reactive references to store values using computed
  const roundsPlayed = computed(() => gameStore.roundsPlayed)
  const totalTaxCollected = computed(() => taxStore.totalTaxCollected)
  const taxRate = computed(() => taxStore.taxRate)
  const taxHistory = computed(() => taxStore.taxHistory)
  const taxStats = computed(() => taxStore.getTaxStats) // Access the getter correctly

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
    const taxAmount = Math.round(winAmount * taxRate.value * 100) / 100
    return winAmount - taxAmount
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

  /**
   * Get recent tax events
   * @param count Number of events to return (default 5)
   */
  const getRecentTaxEvents = (count = 5) => {
    return taxStore.getRecentTaxEvents(count)
  }

  const recentEvents = computed(() =>
    [...taxStore.taxHistory].sort((a, b) => b.timestamp - a.timestamp).slice(0, 20),
  )

  /**
   * Get the state from the local storage
   */
  const updateTaxStoreFromLocalStorage = () => {
    const savedState = localStorage.getItem('taxState')
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      taxStore.$patch(parsedState)
    }
  }

  return {
    processTax,
    calculateAfterTaxWin,
    getTaxByPlayer,
    resetTaxData,
    totalTaxCollected, // reactive computed
    taxRate, // reactive computed
    taxHistory, // reactive computed
    taxStats, // reactive computed
    getRecentTaxEvents,
    recentEvents,
    updateTaxStoreFromLocalStorage,
  }
}
