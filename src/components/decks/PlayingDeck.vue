<template>
  <div class="decks">
    <!-- First face-up card -->
    <PlayingCard v-if="game.faceUpCards[0]" :card-id="game.faceUpCards[0]?.id" :face-up="true" />

    <!-- The third (drawn) card -->
    <PlayingCard v-if="game.currentCard" :card-id="game.currentCard?.id" :face-up="true" />

    <!-- Second face-up card -->
    <PlayingCard v-if="game.faceUpCards[1]" :card-id="game.faceUpCards[1]?.id" :face-up="true" />

    <p>
      Drawn Card: {{ game.currentCard?.suit }} {{ game.currentCard?.rank }} ({{
        game.currentCard?.id
      }})
    </p>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game-store'
import { onMounted } from 'vue'

const game = useGameStore()

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
