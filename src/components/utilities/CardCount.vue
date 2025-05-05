<template>
  <div id="btn10" class="CardCount">
    <h1>{{ gameStore.getCardsLeft }} / 52</h1>
    <h1>CARDS</h1>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game-store'

const gameStore = useGameStore()
</script>

<style>
.CardCount {
  top: 9%;
  left: 17%;
  z-index: 15;
  color: rgb(255, 255, 255);
  font-size: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
