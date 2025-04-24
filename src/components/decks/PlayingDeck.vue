<!-- Deck Display Component
  Shows face-up cards and handles the UI for the draw phase and "equal cards" scenario.
  
  Features:
    - Displays two static face-up cards and the currently drawn card.
    - Outputs the drawn card’s suit, rank, and ID.
    - Includes a countdown timer.
    - If drawn cards are equal, displays a choice prompt for "Higher" or "Lower".

  Uses:
    - PlayingCard component to visually render cards.
    - CountdownTimer component for turn timer.
    - game-store for state management.
-->

<template>
  <div class="decks">
    <!-- First face-up card -->
    <PlayingCard v-if="game.faceUpCards[0]" :card-id="game.faceUpCards[0]?.id" :face-up="true" />

    <!-- Drawn card (placed in the center visually) -->
    <PlayingCard v-if="game.faceUpCards[0]" :card-id="game.currentCard?.id" :face-up="true" />

    <!-- Second face-up card -->
    <PlayingCard v-if="game.faceUpCards[1]" :card-id="game.faceUpCards[1]?.id" :face-up="true" />
  </div>

  <!-- Drawn card detail text -->
  <p>
    Drawn Card: {{ game.currentCard?.suit }} {{ game.currentCard?.rank }} ({{
      game.currentCard?.id
    }})
  </p>

  <!-- Countdown timer for player turn -->
  <timer />

  <!-- Equal card choice UI -->
  <div v-if="game.awaitingEqualChoice">
    <p>Cards are equal! Choose your bet:</p>
    <button @click="game.handleEqualCardsChoice('higher')">Higher</button>
    <button @click="game.handleEqualCardsChoice('lower')">Lower</button>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game-store'
import { onMounted } from 'vue'
import timer from '../utilities/CountdownTimer.vue'

/**
 * Game store instance (centralized game state and logic)
 */
const game = useGameStore()

// ─────────────────────────────
// Lifecycle Hooks
// ─────────────────────────────

/**
 * Initializes game state on mount
 */
onMounted(() => {
  game.initGameState()
})
</script>

<style scope>
.decks {
  width: 9%;
  height: 9%;
}
</style>
