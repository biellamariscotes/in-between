<template>
  <div
    :class="[
      `player-${position}`,
      {
        'active-player': isActive && isCurrentPlayer,
        'inactive-spot': !isActive,
      },
    ]"
  >
    <div
      :class="[
        'player-indicator-container',
        { 'player-info-left': position === 6 },
        { 'player-info-right': position === 5 },
        { 'player-info-reverse': position === 3 || position === 4 },
      ]"
    >
      <div v-if="isActive && isCurrentPlayer" class="turn-indicator">
        <div
          :class="[
            'arrow-animation',
            {
              'arrow-bottom': position === 3 || position === 4,
              'arrow-left': position === 5,
              'arrow-right': position === 6,
            },
          ]"
        ></div>
      </div>

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

defineProps<{
  position: number
  isActive: boolean
  isCurrentPlayer: boolean
  playerName: string
  playerPoints: number
  cards: string[]
}>()
</script>
