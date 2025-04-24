/**
 * Manages the number of registered players and persists it via localStorage.
 * Documentation: src/docs/stores/playerStore.md
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayerStore = defineStore('playerStore', () => {
  // ─────────────────────────────
  // STATES
  // ─────────────────────────────
  const playerCount = ref<number | null>(JSON.parse(localStorage.getItem('playerCount') || 'null'))

  // ─────────────────────────────
  // ACTIONS
  // ─────────────────────────────

  /**
   * Sets the player count value and saves it to localStorage.
   * @param {number} count - The number of players to register.
   */
  const setPlayerCount = (count: number) => {
    playerCount.value = count
    localStorage.setItem('playerCount', JSON.stringify(count))
  }

  /**
   * Clears the player count value from both the state and localStorage.
   */
  const clearPlayerCount = () => {
    playerCount.value = null
    localStorage.removeItem('playerCount')
  }

  return {
    playerCount,
    setPlayerCount,
    clearPlayerCount,
  }
})
