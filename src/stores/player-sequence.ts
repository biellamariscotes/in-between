import type { Player } from '@/interface/player'
import { defineStore } from 'pinia'
import { usePlayerRegistration } from './player'

export const usePlayerOrderStore = defineStore('playerOrderStore', {
  state: () => ({
    orderedPlayerIds: [] as (string | number)[],
    isOrdered: false,
    currentTurnIndex: 0,
  }),

  getters: {
    orderedPlayers(): Player[] {
      const playerStore = usePlayerRegistration()

      return this.orderedPlayerIds
        .map((id) => playerStore.players.find((player) => player.id === id))
        .filter(Boolean) as Player[]
    },

    currentPlayer(): Player | undefined {
      if (!this.isOrdered || this.orderedPlayerIds.length === 0) return undefined

      const playerStore = usePlayerRegistration()
      const currentPlayerId = this.orderedPlayerIds[this.currentTurnIndex]
      return playerStore.players.find((p) => p.id === currentPlayerId)
    },
  },

  actions: {
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

      // Reset player turns
      this._resetAllPlayerTurns()

      // Create a copy for shuffling
      const playersCopy = [...playerStore.players]

      // Fisher-Yates Shuffle
      for (let i = playersCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[playersCopy[i], playersCopy[j]] = [playersCopy[j], playersCopy[i]]
      }

      // Update positions
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

      // Store ordered IDs
      this.orderedPlayerIds = playersCopy.map((p) => p.id as string | number)
      this.isOrdered = true
      this.currentTurnIndex = 0

      // Set first player's turn
      this._setPlayerTurn(this.orderedPlayerIds[0], true)

      // Save state
      this._saveToLocalStorage()

      console.log('✅ Shuffled Players with randomizedPositions assigned and saved to localStorage')
    },

    resetOrder() {
      console.log('🧹 Resetting player order')
      const playerStore = usePlayerRegistration()

      // Reset randomizedPosition and isTurn on all players
      playerStore.players.forEach((player, index) => {
        playerStore.players[index] = {
          ...player,
          randomizedPosition: undefined,
          isTurn: false,
        }
      })

      // Reset store state
      this.orderedPlayerIds = []
      this.isOrdered = false
      this.currentTurnIndex = 0

      // Save state
      this._saveToLocalStorage()

      // Save player data to localStorage
      localStorage.setItem('players', JSON.stringify(playerStore.players))
    },

    nextTurn() {
      if (!this.isOrdered || this.orderedPlayerIds.length === 0) {
        console.warn('❌ Cannot advance turn: players not ordered')
        return
      }

      // Set current player's turn to false
      const currentPlayerId = this.orderedPlayerIds[this.currentTurnIndex]
      this._setPlayerTurn(currentPlayerId, false)

      // Move to next player (wrap around if at the end)
      this.currentTurnIndex = (this.currentTurnIndex + 1) % this.orderedPlayerIds.length

      // Set new current player's turn to true
      const nextPlayerId = this.orderedPlayerIds[this.currentTurnIndex]
      this._setPlayerTurn(nextPlayerId, true)

      // Save state
      this._saveToLocalStorage()
    },

    loadSavedOrder() {
      const savedIds = localStorage.getItem('orderedPlayerIds')
      const savedOrderState = localStorage.getItem('playersOrdered')
      const savedTurnIndex = localStorage.getItem('currentTurnIndex')

      const playerStore = usePlayerRegistration()
      this._resetAllPlayerTurns()

      if (savedIds) {
        this.orderedPlayerIds = JSON.parse(savedIds)

        // Update the player store with saved randomizedPositions
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

        // Set the current player's turn to true
        const currentPlayerId = this.orderedPlayerIds[this.currentTurnIndex]
        if (currentPlayerId) {
          this._setPlayerTurn(currentPlayerId, true)
        }
      }

      // Save player data to localStorage after updates
      localStorage.setItem('players', JSON.stringify(playerStore.players))
    },

    // Private helper methods
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

    _resetAllPlayerTurns() {
      const playerStore = usePlayerRegistration()
      playerStore.players.forEach((player, index) => {
        playerStore.players[index] = { ...player, isTurn: false }
      })
    },

    _saveToLocalStorage() {
      const playerStore = usePlayerRegistration()

      // Save order state
      localStorage.setItem('orderedPlayerIds', JSON.stringify(this.orderedPlayerIds))
      localStorage.setItem('playersOrdered', JSON.stringify(this.isOrdered))
      localStorage.setItem('currentTurnIndex', String(this.currentTurnIndex))

      // Save player data
      localStorage.setItem('players', JSON.stringify(playerStore.players))
    },
  },
})
