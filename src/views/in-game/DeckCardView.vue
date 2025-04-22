<template>
  <div>
    <h2>Number of Players: {{ playerCount }}</h2>
    <button @click="game.startGame()">Start Game</button>
    <button @click="game.drawThirdCard()">Draw 3rd card</button>
    <button @click="game.fold()">Fold</button>
    <p v-if="game.hasFolded">{{ game.message }}</p>

    <PlayingCardDeck />

    <div>
      <p>Pot: {{ game.pot }}</p>
      <p>{{ game.message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlayingCardDeck from '@/components/decks/PlayingDeck.vue'
import { useGameStore } from '@/stores/game-store'
import { usePlayerStore } from '@/stores/player-count'
import { computed } from 'vue'

const game = useGameStore()

const playerStore = usePlayerStore()
const playerCount = computed(() => playerStore.playerCount ?? 6)
</script>

<style scooped>
button {
  color: red;
  text-align: center;
  width: 100px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>
