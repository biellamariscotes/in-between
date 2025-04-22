<template>
  <div class="test">
    <!-- First face-up card -->
    <PlayingCard v-if="game.faceUpCards[0]" :card-id="game.faceUpCards[0]?.id" :face-up="true" />

    <!-- The third (drawn) card -->
    <PlayingCard v-if="game.faceUpCards[0]" :card-id="game.currentCard?.id" :face-up="true" />

    <!-- Second face-up card -->
    <PlayingCard v-if="game.faceUpCards[1]" :card-id="game.faceUpCards[1]?.id" :face-up="true" />
  </div>
  <p>
    Drawn Card: {{ game.currentCard?.suit }} {{ game.currentCard?.rank }} ({{
      game.currentCard?.id
    }})
  </p>
  <timer />

  <div v-if="game.awaitingEqualChoice">
    <p>Cards are equal! Choose your bet:</p>
    <button @click="game.handleEqualCardsChoice('higher')">Higher</button>
    <button @click="game.handleEqualCardsChoice('lower')">Lower</button>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game-store'
import { onMounted } from 'vue'
import timer from '../CountdownTimer.vue'
const game = useGameStore()

onMounted(() => {
  game.initGameState()
})
</script>

<style scoped>
.test {
  width: 10%;
  height: 10%;
}
</style>
