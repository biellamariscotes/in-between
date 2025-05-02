<template>
  <div class="CardCount">
    <h1>
      52 / {{ gameStore.getCardsLeft }} <br />
      CARDS
    </h1>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game-store'

const gameStore = useGameStore()
</script>

<style>
.CardCount {
  position: absolute;
  top: 9%;
  left: 17%;
  z-index: 15;
  color: rgb(255, 255, 255);
  font-size: 10px;
}
</style>
