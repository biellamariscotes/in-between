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
        { 'player-info-left': position === 3 },
        { 'player-info-right': position === 6 },
        { 'player-info-reverse': position === 5 || position === 4 },
      ]"
      id="btn3"
    >
      <!-- Turn Indicator Arrow -->
      <div v-if="isActive && isCurrentPlayer" class="turn-indicator">
        <div
          :class="[
            'arrow-animation',
            { 'arrow-bottom': position === 4 || position === 5 },
            { 'arrow-left': position === 6 },
            { 'arrow-right': position === 3 },
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
        <h1 class="player-points">₱ {{ playerPoints.toLocaleString() || 0 }}</h1>
      </div>

      <!-- Player Hand Display -->
      <PlayerHand
        :cards="cards"
        :show-cards="isCurrentPlayer"
        :orientation="getHandOrientation(position)"
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

// Function to return the proper hand orientation based on position
function getHandOrientation(position: number): string {
  switch (position) {
    case 3: // Middle right - needs vertical orientation like player 6
      return 'right'
    case 5: // Top left - needs vertical orientation like player 4
      return 'normal'
    case 6: // Middle left
      return 'right'
    default:
      return 'normal'
  }
}
</script>