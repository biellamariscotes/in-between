import type { Player } from '@/interface/player'
import { defineStore } from 'pinia'

export const usePlayerRegistration = defineStore('playerRegistrationStore', {
  state: () => ({
    players: [] as Player[],
  }),
  getters: {
    // function for modifying / manipulating state
  },

  actions: {
    // actions such as crud implementation function

    // to create a new player
    registerPlayer(player: Player) {
      // Retrieve the existing array from localStorage
      const existingData = localStorage.getItem('players')
      const players = existingData ? JSON.parse(existingData) : [] // Parse or initialize as empty array

      // Append the new student to the array unshift to add the item at the start of an array
      players.unshift(player)

      // Save the updated array back to localStorage
      localStorage.setItem('players', JSON.stringify(players))

      // Update the local state
      this.players = players
    },

    clearPlayers() {
      // Clear both the state and localStorage
      this.players = []
      localStorage.removeItem('players')
    },

    loadPlayersFromStorage() {
      const existingData = localStorage.getItem('players')
      this.players = existingData ? JSON.parse(existingData) : []
    },
  },
})
