// player-order.ts
import type { Player } from '@/interface/player'
import { defineStore } from 'pinia'
import { usePlayerRegistration } from './player'
import { ref, computed } from 'vue'

export const usePlayerOrderStore = defineStore('playerOrderStore', () => {
  // State
  const orderedPlayerIds = ref<(string | number)[]>([])
  const isOrdered = ref(false)
  const currentTurnIndex = ref(0) // Track which player's turn it is

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

    // Reset all players' isTurn first
    playerStore.players.forEach((player, index) => {
      playerStore.players[index] = { ...player, isTurn: false }
    })

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
    orderedPlayerIds.value = playersCopy.map((p) => p.id as string | number)
    isOrdered.value = true

    // Set first player's turn to true
    if (orderedPlayerIds.value.length > 0) {
      currentTurnIndex.value = 0
      const firstPlayerId = orderedPlayerIds.value[0]
      const firstPlayerIndex = playerStore.players.findIndex((p) => p.id === firstPlayerId)

      if (firstPlayerIndex !== -1) {
        playerStore.players[firstPlayerIndex] = {
          ...playerStore.players[firstPlayerIndex],
          isTurn: true,
        }
        console.log(`🎮 It's now ${playerStore.players[firstPlayerIndex].name}'s turn`)
      }
    }

    // Save all player data to localStorage
    localStorage.setItem('players', JSON.stringify(playerStore.players))

    // Save order state
    localStorage.setItem('orderedPlayerIds', JSON.stringify(orderedPlayerIds.value))
    localStorage.setItem('playersOrdered', JSON.stringify(true))
    localStorage.setItem('currentTurnIndex', String(currentTurnIndex.value))

    console.log('✅ Shuffled Players with randomizedPositions assigned and saved to localStorage')
  }

  function resetOrder() {
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

    // Save player data to localStorage
    localStorage.setItem('players', JSON.stringify(playerStore.players))

    orderedPlayerIds.value = []
    isOrdered.value = false
    currentTurnIndex.value = 0

    localStorage.removeItem('orderedPlayerIds')
    localStorage.removeItem('playersOrdered')
    localStorage.removeItem('currentTurnIndex')
  }

  function nextTurn() {
    if (!isOrdered.value || orderedPlayerIds.value.length === 0) {
      console.warn('❌ Cannot advance turn: players not ordered')
      return
    }

    const playerStore = usePlayerRegistration()

    // Set current player's turn to false
    const currentPlayerId = orderedPlayerIds.value[currentTurnIndex.value]
    const currentPlayerIndex = playerStore.players.findIndex((p) => p.id === currentPlayerId)
    if (currentPlayerIndex !== -1) {
      playerStore.players[currentPlayerIndex] = {
        ...playerStore.players[currentPlayerIndex],
        isTurn: false,
      }
    }

    // Move to next player (wrap around if at the end)
    currentTurnIndex.value = (currentTurnIndex.value + 1) % orderedPlayerIds.value.length

    // Set new current player's turn to true
    const nextPlayerId = orderedPlayerIds.value[currentTurnIndex.value]
    const nextPlayerIndex = playerStore.players.findIndex((p) => p.id === nextPlayerId)
    if (nextPlayerIndex !== -1) {
      playerStore.players[nextPlayerIndex] = {
        ...playerStore.players[nextPlayerIndex],
        isTurn: true,
      }
      console.log(`🎮 It's now ${playerStore.players[nextPlayerIndex].name}'s turn`)
    }

    // Save player data to localStorage
    localStorage.setItem('players', JSON.stringify(playerStore.players))

    // Save current turn index
    localStorage.setItem('currentTurnIndex', String(currentTurnIndex.value))
  }

  function loadSavedOrder() {
    const savedIds = localStorage.getItem('orderedPlayerIds')
    const savedOrderState = localStorage.getItem('playersOrdered')
    const savedTurnIndex = localStorage.getItem('currentTurnIndex')

    const playerStore = usePlayerRegistration()

    // First reset all isTurn values to false
    playerStore.players.forEach((player, index) => {
      playerStore.players[index] = { ...player, isTurn: false }
    })

    if (savedIds) {
      orderedPlayerIds.value = JSON.parse(savedIds)

      // Update the player store with saved randomizedPositions
      orderedPlayerIds.value.forEach((id, index) => {
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
        orderedPlayerIds.value,
      )
    }

    if (savedOrderState) {
      isOrdered.value = JSON.parse(savedOrderState)
      console.log('✅ Loaded isOrdered state:', isOrdered.value)
    }

    if (savedTurnIndex && isOrdered.value) {
      currentTurnIndex.value = parseInt(savedTurnIndex, 10)

      // Set the current player's turn to true
      const currentPlayerId = orderedPlayerIds.value[currentTurnIndex.value]
      if (currentPlayerId) {
        const currentPlayerIndex = playerStore.players.findIndex((p) => p.id === currentPlayerId)
        if (currentPlayerIndex !== -1) {
          playerStore.players[currentPlayerIndex] = {
            ...playerStore.players[currentPlayerIndex],
            isTurn: true,
          }
          console.log(`🎮 Restored turn to ${playerStore.players[currentPlayerIndex].name}`)
        }
      }
    }

    // Save player data to localStorage
    localStorage.setItem('players', JSON.stringify(playerStore.players))
  }

  return {
    // State
    orderedPlayerIds,
    isOrdered,
    currentTurnIndex,

    // Getters
    orderedPlayers,

    // Actions
    randomizeOrder,
    resetOrder,
    loadSavedOrder,
    nextTurn,
  }
})
