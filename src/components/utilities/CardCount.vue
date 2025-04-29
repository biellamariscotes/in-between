<template>
  <div>
    <h1>52/{{ gameStore.getCardsLeft }}</h1>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game-store'

// Access the Pinia store by calling the function
const gameStore = useGameStore()
</script>
