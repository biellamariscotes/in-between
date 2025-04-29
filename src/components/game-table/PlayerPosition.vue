<!-- Player Slot Component
  Displays a player's slot in the game table UI, including:
    - Turn indicator if it's their turn
    - Player name and points
    - Player's hand of cards

  Props:
    - position: number — Slot position on the game table
    - isActive: boolean — Whether this player slot is active
    - isCurrentPlayer: boolean — Whether this player is the current turn holder
    - playerName: string — Name displayed in the slot
    - playerPoints: number — Player's current score
    - cards: string[] — Array of card IDs in player's hand

  Uses:
    - PlayerHand component for displaying card hands
-->

<template>
  <div
    :class="[
      `player-${position}`,
      { 'active-player': isActive && isCurrentPlayer, 'inactive-spot': !isActive },
    ]"
  >
    <div
      :class="[
        'player-indicator-container',
        { 'player-info-left': position === 6 },
        { 'player-info-right': position === 5 },
        { 'player-info-reverse': position === 3 || position === 4 },
      ]"
      id="btn3"
    >
      <!-- Turn Indicator Arrow -->
      <div v-if="isActive && isCurrentPlayer" class="turn-indicator">
        <div
          :class="[
            'arrow-animation',
            { 'arrow-bottom': position === 3 || position === 4 },
            { 'arrow-left': position === 5 },
            { 'arrow-right': position === 6 },
          ]"
        ></div>
      </div>

      <!-- Player Info Section -->
      <div
        style="display: flex; flex-direction: column; justify-items: center; align-items: center"
      >
        <h1 class="player-name">
          <template v-if="isActive && playerName">
            {{ playerName }}
          </template>
          <template v-else> Empty </template>
        </h1>
        <h1 class="player-points">P {{ playerPoints || 0 }}</h1>
      </div>

      <!-- Player Hand Display -->
      <PlayerHand
        :cards="cards"
        :show-cards="isCurrentPlayer"
        :orientation="position === 5 ? 'left' : position === 6 ? 'right' : 'normal'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import PlayerHand from '../game-table/PlayerHand.vue'

/**
 * Props
 */

defineProps<{
  position: number
  isActive: boolean
  isCurrentPlayer: boolean
  playerName: string
  playerPoints: number
  cards: string[]
}>()
</script>
