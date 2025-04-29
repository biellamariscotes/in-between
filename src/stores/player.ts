/**
 * Handles player registration, storage, and retrieval.
 */

import type { Player } from '@/interface/player'
import { defineStore } from 'pinia'

export const usePlayerRegistration = defineStore('playerRegistrationStore', {
  // ─────────────────────────────
  // STATES
  // ─────────────────────────────
  state: () => ({
    players: [] as Player[],
  }),

  // ─────────────────────────────
  // GETTERS
  // ─────────────────────────────

  getters: {
    getTotalCredits: (state) => {
      return state.players.reduce((acc, player) => {
        return acc + (player.credits ?? 0)
      }, 0)
    },
  },

  // ─────────────────────────────
  // ACTIONS
  // ─────────────────────────────
  actions: {
    /**
     * Registers a new player by adding them to the state and localStorage.
     * @param {Player} player - The player object to be registered.
     */
    registerPlayer(player: Player) {
      const existingData = localStorage.getItem('players')
      const players = existingData ? JSON.parse(existingData) : []

      players.unshift(player)

      localStorage.setItem('players', JSON.stringify(players))

      this.players = players
    },

    /**
     * Clears all registered players from the state and localStorage.
     */
    clearPlayers() {
      this.players = []
      localStorage.removeItem('players')
    },

    /**
     * Loads player data from localStorage into the state.
     */
    loadPlayersFromStorage() {
      const existingData = localStorage.getItem('players')
      this.players = existingData ? JSON.parse(existingData) : []
    },
  },
})
