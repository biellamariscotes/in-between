// player-order.ts
import type { Player } from '@/interface/player'
import { defineStore } from 'pinia'
import { usePlayerRegistration } from './player'
import { ref, computed } from 'vue'

export const usePlayerOrderStore = defineStore('playerOrderStore', () => {
  // State
  const orderedPlayerIds = ref<(string | number)[]>([])
  const isOrdered = ref(false)

  // Getters
  const orderedPlayers = computed(() => {
    const playerStore = usePlayerRegistration()

    return orderedPlayerIds.value
      .map((id) => {
        return playerStore.players.find((player) => player.id === id)
      })
      .filter(Boolean) as Player[]
  })

  // Actions
  function randomizeOrder() {
    const playerStore = usePlayerRegistration()
    const players = playerStore.players

    console.log(
      '📋 Players before randomization:',
      players.map((p) => ({
        id: p.id,
        name: p.name,
        credits: p.credits,
      })),
    )

    if (players.length === 0) {
      console.warn('❌ No players available to randomize!')
      return
    }

    // Create a copy of players to shuffle
    const playersCopy = [...players]

    // Fisher-Yates Shuffle
    for (let i = playersCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[playersCopy[i], playersCopy[j]] = [playersCopy[j], playersCopy[i]]
    }

    // Update the original players with randomizedPosition values
    playersCopy.forEach((player, index) => {
      const originalPlayer = players.find((p) => p.id === player.id)
      if (originalPlayer) {
        originalPlayer.randomizedPosition = index + 1
        console.log(
          `🎯 Player ${originalPlayer.name} (ID: ${originalPlayer.id}) assigned randomizedPosition ${originalPlayer.randomizedPosition}`,
        )
      }
    })

    // Store the ordered IDs
    orderedPlayerIds.value = playersCopy.map((p) => p.id as string | number)
    isOrdered.value = true

    console.log('✅ Shuffled Players with randomizedPositions assigned')

    // Persist to localStorage
    localStorage.setItem('orderedPlayerIds', JSON.stringify(orderedPlayerIds.value))
    localStorage.setItem('playersOrdered', JSON.stringify(true))
  }

  function resetOrder() {
    console.log('🧹 Resetting player order')
    const playerStore = usePlayerRegistration()

    // Reset randomizedPosition and order on all players
    playerStore.players.forEach((player) => {
      player.randomizedPosition = undefined
    })

    orderedPlayerIds.value = []
    isOrdered.value = false
    localStorage.removeItem('orderedPlayerIds')
    localStorage.removeItem('playersOrdered')
  }

  function loadSavedOrder() {
    const savedIds = localStorage.getItem('orderedPlayerIds')
    const savedOrderState = localStorage.getItem('playersOrdered')

    if (savedIds) {
      orderedPlayerIds.value = JSON.parse(savedIds)

      // Also update the player store with saved randomizedPositions
      const playerStore = usePlayerRegistration()

      orderedPlayerIds.value.forEach((id, index) => {
        const player = playerStore.players.find((p) => p.id === id)
        if (player) {
          player.randomizedPosition = index + 1
        }
      })

      console.log(
        '✅ Loaded orderedPlayerIds and updated randomizedPositions:',
        orderedPlayerIds.value,
      )
    }

    if (savedOrderState) {
      isOrdered.value = JSON.parse(savedOrderState)
      console.log('✅ Loaded isOrdered state:', isOrdered.value)
    }
  }

  return {
    // State
    orderedPlayerIds,
    isOrdered,

    // Getters
    orderedPlayers,

    // Actions
    randomizeOrder,
    resetOrder,
    loadSavedOrder,
  }
})
