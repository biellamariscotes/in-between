/**
 * Handles player turn randomization and progression.
 * Documentation: src/docs/stores/playerSequence.md
 */

import type { Player } from '@/interface/player'
import { defineStore } from 'pinia'
import { usePlayerRegistration } from './player'

export const usePlayerOrderStore = defineStore('playerOrderStore', {
  // ─────────────────────────────
  // STATES
  // ─────────────────────────────
  state: () => ({
    orderedPlayerIds: [] as (string | number)[],
    isOrdered: false,
    currentTurnIndex: 0,
  }),

  // ─────────────────────────────
  // GETTERS
  // ─────────────────────────────
  getters: {
    /**
     * Get ordered list of Player objects based on randomized order.
     */
    orderedPlayers(): Player[] {
      const playerStore = usePlayerRegistration()

      return this.orderedPlayerIds
        .map((id) => playerStore.players.find((player) => player.id === id))
        .filter(Boolean) as Player[]
    },

    /**
     * Get the current player whose turn it is.
     */
    currentPlayer(): Player | undefined {
      if (!this.isOrdered || this.orderedPlayerIds.length === 0) return undefined

      const playerStore = usePlayerRegistration()
      const currentPlayerId = this.orderedPlayerIds[this.currentTurnIndex]
      return playerStore.players.find((p) => p.id === currentPlayerId)
    },
  },

  // ─────────────────────────────
  // ACTIONS
  // ─────────────────────────────
  actions: {
    /**
     * Randomizes player order using Fisher-Yates algorithm,
     * assigns randomizedPosition, and sets the first player's turn.
     */
    randomizeOrder() {
      const playerStore = usePlayerRegistration()

      console.log(
        '📋 Players before randomization:',
        playerStore.players.map((p) => ({
          id: p.id,
          name: p.name,
          credits: p.credits,
        })),
      )

      if (playerStore.players.length === 0) {
        console.warn('❌ No players available to randomize!')
        return
      }

      this._resetAllPlayerTurns()

      const playersCopy = [...playerStore.players]

      // 🎲 Fisher-Yates Shuffle
      for (let i = playersCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[playersCopy[i], playersCopy[j]] = [playersCopy[j], playersCopy[i]]
      }

      // Assign randomizedPosition
      playersCopy.forEach((player, index) => {
        const originalIndex = playerStore.players.findIndex((p) => p.id === player.id)
        if (originalIndex !== -1) {
          playerStore.players[originalIndex] = {
            ...playerStore.players[originalIndex],
            randomizedPosition: index + 1,
          }
          console.log(
            `🎯 Player ${player.name} (ID: ${player.id}) assigned randomizedPosition ${index + 1}`,
          )
        }
      })

      this.orderedPlayerIds = playersCopy.map((p) => p.id as string | number)
      this.isOrdered = true
      this.currentTurnIndex = 0

      this._setPlayerTurn(this.orderedPlayerIds[0], true)
      this._saveToLocalStorage()

      console.log('✅ Shuffled Players with randomizedPositions assigned and saved to localStorage')
    },

    /**
     * Resets the player order and all related data.
     */
    resetOrder() {
      console.log('🧹 Resetting player order')
      const playerStore = usePlayerRegistration()

      playerStore.players.forEach((player, index) => {
        playerStore.players[index] = {
          ...player,
          randomizedPosition: undefined,
          isTurn: false,
        }
      })

      this.orderedPlayerIds = []
      this.isOrdered = false
      this.currentTurnIndex = 0

      this._saveToLocalStorage()
      localStorage.setItem('players', JSON.stringify(playerStore.players))
    },

    /**
     * Advances the turn to the next player in the order.
     */
    nextTurn() {
      if (!this.isOrdered || this.orderedPlayerIds.length === 0) {
        console.warn('❌ Cannot advance turn: players not ordered')
        return
      }

      const currentPlayerId = this.orderedPlayerIds[this.currentTurnIndex]
      this._setPlayerTurn(currentPlayerId, false)

      this.currentTurnIndex = (this.currentTurnIndex + 1) % this.orderedPlayerIds.length

      const nextPlayerId = this.orderedPlayerIds[this.currentTurnIndex]
      this._setPlayerTurn(nextPlayerId, true)

      this._saveToLocalStorage()
    },

    /**
     * Loads saved player order and turn index from localStorage.
     */
    loadSavedOrder() {
      const savedIds = localStorage.getItem('orderedPlayerIds')
      const savedOrderState = localStorage.getItem('playersOrdered')
      const savedTurnIndex = localStorage.getItem('currentTurnIndex')

      const playerStore = usePlayerRegistration()
      this._resetAllPlayerTurns()

      if (savedIds) {
        this.orderedPlayerIds = JSON.parse(savedIds)

        this.orderedPlayerIds.forEach((id, index) => {
          const playerIndex = playerStore.players.findIndex((p) => p.id === id)
          if (playerIndex !== -1) {
            playerStore.players[playerIndex] = {
              ...playerStore.players[playerIndex],
              randomizedPosition: index + 1,
            }
          }
        })

        console.log(
          '✅ Loaded orderedPlayerIds and updated randomizedPositions:',
          this.orderedPlayerIds,
        )
      }

      if (savedOrderState) {
        this.isOrdered = JSON.parse(savedOrderState)
        console.log('✅ Loaded isOrdered state:', this.isOrdered)
      }

      if (savedTurnIndex && this.isOrdered) {
        this.currentTurnIndex = parseInt(savedTurnIndex, 10)
        const currentPlayerId = this.orderedPlayerIds[this.currentTurnIndex]
        if (currentPlayerId) this._setPlayerTurn(currentPlayerId, true)
      }

      localStorage.setItem('players', JSON.stringify(playerStore.players))
    },

    // ─────────────────────────────
    // PRIVATE HELPERS
    // ─────────────────────────────

    /**
     * Sets a player's turn status.
     */
    _setPlayerTurn(playerId: string | number, isTurn: boolean) {
      const playerStore = usePlayerRegistration()
      const playerIndex = playerStore.players.findIndex((p) => p.id === playerId)

      if (playerIndex !== -1) {
        playerStore.players[playerIndex] = {
          ...playerStore.players[playerIndex],
          isTurn,
        }

        if (isTurn) {
          console.log(`🎮 It's now ${playerStore.players[playerIndex].name}'s turn`)
        }
      }
    },

    /**
     * Resets all players' turn flags.
     */
    _resetAllPlayerTurns() {
      const playerStore = usePlayerRegistration()
      playerStore.players.forEach((player, index) => {
        playerStore.players[index] = { ...player, isTurn: false }
      })
    },

    /**
     * Saves current order and player data to localStorage.
     */
    _saveToLocalStorage() {
      const playerStore = usePlayerRegistration()
      localStorage.setItem('orderedPlayerIds', JSON.stringify(this.orderedPlayerIds))
      localStorage.setItem('playersOrdered', JSON.stringify(this.isOrdered))
      localStorage.setItem('currentTurnIndex', String(this.currentTurnIndex))
      localStorage.setItem('players', JSON.stringify(playerStore.players))
    },
  },
})
