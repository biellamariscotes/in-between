/**
 * Manages the taxation of all-in wins
 * Documentation: src/docs/stores/taxStore.md
 */

import { defineStore } from 'pinia'
import { usePlayerRegistration } from '@/stores/player'

interface TaxState {
  totalTaxCollected: number
  taxRate: number
  taxHistory: TaxEvent[]
  initialized: boolean
}

interface TaxEvent {
  playerName: string
  playerId: string | number
  amount: number
  timestamp: number
  roundNumber: number
}

export const useTaxStore = defineStore('tax', {
  state: (): TaxState => {
    // Check if we should use saved state
    try {
      const savedState = localStorage.getItem('taxState')
      if (savedState) {
        return JSON.parse(savedState) as TaxState
      }
    } catch (e) {
      console.error('Failed to parse saved tax state:', e)
    }

    return {
      totalTaxCollected: 0,
      taxRate: 0.05, // 5% tax rate
      taxHistory: [],
      initialized: false,
    }
  },

  getters: {
    getTotalTax: (state) => state.totalTaxCollected,
    getTaxRate: (state) => state.taxRate * 100, // Return as percentage
    getTaxHistory: (state) => state.taxHistory,

    // Get tax collected per player
    getTaxByPlayer: (state) => {
      const taxByPlayer: Record<string, number> = {}

      state.taxHistory.forEach((event) => {
        if (!taxByPlayer[event.playerId]) {
          taxByPlayer[event.playerId] = 0
        }
        taxByPlayer[event.playerId] += event.amount
      })

      return taxByPlayer
    },

    // Get stats for the dashboard
    getTaxStats: (state) => {
      return {
        totalCollected: state.totalTaxCollected,
        numberOfTaxEvents: state.taxHistory.length,
        averageTaxAmount:
          state.taxHistory.length > 0 ? state.totalTaxCollected / state.taxHistory.length : 0,
        largestTaxAmount:
          state.taxHistory.length > 0
            ? Math.max(...state.taxHistory.map((event) => event.amount))
            : 0,
      }
    },
  },

  actions: {
    initialize() {
      if (!this.initialized) {
        this.loadTaxState()
        this.initialized = true
      }
    },

    // Save state to localStorage
    saveTaxState() {
      localStorage.setItem('taxState', JSON.stringify(this.$state))
    },

    // Load state from localStorage
    loadTaxState() {
      try {
        const savedState = localStorage.getItem('taxState')
        if (savedState) {
          const parsedState = JSON.parse(savedState) as TaxState
          this.$patch(parsedState)
        }
      } catch (e) {
        console.error('Failed to load tax state:', e)
      }
    },

    // Update tax rate
    setTaxRate(rate: number) {
      if (rate < 0 || rate > 1) {
        console.error('Tax rate must be between 0 and 1')
        return
      }

      this.taxRate = rate
      this.saveTaxState()
    },

    // Collect tax on an all-in win
    collectTax(playerId: string | number | undefined, winAmount: number, roundNumber: number) {
      // If win amount is 0 or negative, no tax is collected
      if (winAmount <= 0) return 0

      const playerStore = usePlayerRegistration()
      const player = playerStore.players.find((p) => p.id === playerId)

      if (!player) {
        console.error('Player not found when collecting tax')
        return 0
      }

      // Calculate tax amount (rounded to 2 decimal places)
      const taxAmount = Math.round(winAmount * this.taxRate * 100) / 100

      // Update total tax collected
      this.totalTaxCollected += taxAmount

      // Add to tax history with proper type handling for playerId
      this.taxHistory.push({
        playerName: player.name || `Player ${String(playerId)}`,
        playerId: player.id || String(playerId), // Ensure proper type conversion
        amount: taxAmount,
        timestamp: Date.now(),
        roundNumber,
      })

      // Save state
      this.saveTaxState()

      return taxAmount
    },

    // Reset tax information
    resetTax() {
      this.totalTaxCollected = 0
      this.taxHistory = []
      this.saveTaxState()
    },

    // Get recent tax events
    getRecentTaxEvents(count = 5) {
      return [...this.taxHistory].sort((a, b) => b.timestamp - a.timestamp).slice(0, count)
    },
  },
})
