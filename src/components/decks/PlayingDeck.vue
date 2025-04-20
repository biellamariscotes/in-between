<template>
  <div class="deck flex gap-4 justify-center" height="100px" width="100px">
    <!-- First face-up card -->
    <PlayingCard v-if="game.faceUpCards[0]" :card-id="game.faceUpCards[0]?.id" :face-up="true" />

    <!-- The third (drawn) card -->
    <PlayingCard v-if="game.currentCard" :card-id="game.currentCard?.id" :face-up="false" />

    <!-- Second face-up card -->
    <PlayingCard v-if="game.faceUpCards[1]" :card-id="game.faceUpCards[1]?.id" :face-up="true" />
  </div>

  <PlayingCard cardId="h7" :faceUp="true" />
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game-store'

const game = useGameStore()

// Debugging outputs
console.log('Face Up Cards:', game.faceUpCards) // Log the faceUpCards array to see its state
console.log('Current Card:', game.currentCard) // Log the current drawn card
console.log('Game Store:', game) // Log the full game store to check if it is initialized
</script>
