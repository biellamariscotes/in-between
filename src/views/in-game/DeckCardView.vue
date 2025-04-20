<template>
  <div class="game-zone space-y-4 p-4">
    <button class="bg-blue-500 text-white px-4 py-2 rounded" @click="game.startGame()">
      Start Game
    </button>

    <PlayingCardDeck />

    <div class="text-center text-gray-700 mt-4">
      <p>Pot: {{ game.pot }}</p>
      <p>{{ game.message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlayingCardDeck from '@/components/decks/PlayingDeck.vue'
import { useGameStore } from '@/stores/game-store'
import { onMounted } from 'vue'

const game = useGameStore()

onMounted(() => {
  game.startGame()
})
</script>
