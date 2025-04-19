// player-order.ts
import type { Player } from '@/interface/player'
import { defineStore } from 'pinia'
import { usePlayerRegistration } from './player'

export const usePlayerOrderStore = defineStore('playerOrderStore', {
  state: () => ({
    orderedPlayerIds: [] as (string | number)[],
    isOrdered: false,
  }),

  getters: {
    orderedPlayers: (state) => {
      const playerStore = usePlayerRegistration()
      const orderedPlayers: Player[] = []

      console.log('🔄 Getting ordered players for IDs:', state.orderedPlayerIds)

      state.orderedPlayerIds.forEach((id, index) => {
        const player = playerStore.players.find((p) => p.id === id)
        if (player) {
          const orderedPlayer = { ...player, order: index + 1 }
          orderedPlayers.push(orderedPlayer)
          console.log(`✅ Found player for ID ${id}:`, orderedPlayer)
        } else {
          console.warn(`⚠️ No player found for ID ${id}`)
        }
      })

      return orderedPlayers
    },
  },

  actions: {
    randomizeOrder() {
      const playerStore = usePlayerRegistration()
      const playerIds = playerStore.players.map((player) => player.id as string | number)

      console.log('📋 Players in store before shuffle:', playerStore.players)

      if (playerIds.length === 0) {
        console.warn('❌ No players available to randomize!')
        return
      }

      // Fisher-Yates shuffle
      for (let i = playerIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[playerIds[i], playerIds[j]] = [playerIds[j], playerIds[i]]
      }

      this.orderedPlayerIds = playerIds
      this.isOrdered = true

      console.log('✅ Randomized order:', this.orderedPlayerIds)

      localStorage.setItem('orderedPlayerIds', JSON.stringify(playerIds))
      localStorage.setItem('playersOrdered', JSON.stringify(true))
    },

    resetOrder() {
      console.log('🧹 Resetting player order')
      this.orderedPlayerIds = []
      this.isOrdered = false
      localStorage.removeItem('orderedPlayerIds')
      localStorage.removeItem('playersOrdered')
    },

    loadSavedOrder() {
      const savedIds = localStorage.getItem('orderedPlayerIds')
      const savedOrderState = localStorage.getItem('playersOrdered')

      if (savedIds) {
        this.orderedPlayerIds = JSON.parse(savedIds)
        console.log('✅ Loaded orderedPlayerIds:', this.orderedPlayerIds)
      }

      if (savedOrderState) {
        this.isOrdered = JSON.parse(savedOrderState)
        console.log('✅ Loaded isOrdered state:', this.isOrdered)
      }
    },
  },
})
