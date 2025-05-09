<!-- Player Hand Component
  Displays a set of playing cards for a player.
  
  Props:
    - cards: string[] — Array of card IDs in the player's hand.
    - showCards: boolean — Whether to display cards face-up.
    - orientation: string — Layout orientation: 'normal' | 'left' | 'right'.

  Uses:
    - PlayingCard component to render each individual card.

  Features:
    - Dynamic CSS custom property for card count.
    - Optional orientation-based class for hand alignment.
-->

<template>
  <div
    class="player-hand"
    :class="[
      orientation === 'left' ? 'hand-left' : orientation === 'right' ? 'hand-right' : 'hand-normal',
    ]"
    :style="handStyle"
  >
    <!-- Card Slot -->
    <div class="card-wrapper" v-for="(cardId, index) in cards" :key="index">
      <PlayingCard :card-id="cardId" :face-up="showCards" class="player-card" />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Script setup section
 */
import { defineProps, computed } from 'vue'
import PlayingCard from '../game-table/PlayingCard.vue'

/**
 * Props
 */
const props = defineProps({
  cards: {
    type: Array as () => string[],
    default: () => [],
  },
  showCards: {
    type: Boolean,
    default: false,
  },
  orientation: {
    type: String,
    default: 'normal',
    validator: (value: string) => ['normal', 'left', 'right'].includes(value),
  },
})

// ─────────────────────────────
// Computed Properties
// ─────────────────────────────

/**
 * Generates dynamic inline styles based on card count.
 * Sets a CSS custom property (--card-count) for layout adjustments.
 */
const handStyle = computed(() => ({
  '--card-count': props.cards.length,
}))
</script>

<style scoped>
.player-hand {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%; /* Take full height of parent */
  position: relative;
  transition: transform 0.2s ease;
}

.card-wrapper {
  width: auto;
  height: 100%;
  max-width: calc(100% / var(--card-count, 1));
  flex: 1;
  position: relative;
  padding: 0 2px; /* Add some spacing between cards */
  display: flex;
  justify-content: center;
  min-width: 60px;
  @media screen and (orientation: landscape) and (max-width: 932px) and (max-height: 430px) {
    min-width: 30px;
  }
}

/* Rotate the entire hand container instead of individual cards */
.hand-left {
  transform: rotate(90deg);
  transform-origin: center center;
}

.hand-right {
  transform: rotate(-90deg);
  transform-origin: center center;
}

.hand-left,
.player-card {
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.2s ease;
}

.player-card:hover {
  transform: translateY(-5px);
  z-index: 5;
}

/* Adjust hover effect for rotated hands */
.hand-left .player-card:hover {
  transform: translateX(-5px);
}

.hand-right .player-card:hover {
  transform: translateX(5px);
}
</style>
