<template>
  <div class="game-zone">
    <div class="card-table">
      <div class="game-cards">
        <div class="face-up-card" v-if="leftCard">
          <PlayerHand :cards="[leftCard]" :show-cards="true" orientation="normal" />
        </div>

        <div class="face-up-card" v-if="showMiddleCard">
          <PlayerHand :cards="[middleCard]" :show-cards="true" orientation="normal" />
        </div>
        <div class="face-up-card" v-else>
          <div class="card-placeholder"></div>
        </div>

        <div class="face-up-card" v-if="rightCard">
          <PlayerHand :cards="[rightCard]" :show-cards="true" orientation="normal" />
        </div>
      </div>

      <CashFlow :gameStore="gameStore" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useGameStore } from '@/stores/game-store'
import PlayerHand from '@/components/PlayerHand.vue'

const gameStore = useGameStore()

defineProps<{
  leftCard: string
  middleCard: string
  rightCard: string
  showMiddleCard: boolean
  playerCredit: number
}>()
</script>

<style scoped>
.game-cards {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  height: 100%;
  padding: 10px;
}

.face-up-card {
  width: 100px;
  height: 140px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-placeholder {
  display: flex;
  width: 100px;
  height: 140px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border: 2px dashed rgba(255, 255, 255, 0.3);
}

.card-table {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.credit-display {
  color: white;
  text-align: center;
  margin-top: 15px;
  /* background-color: rgba(0, 0, 0, 0.7); */
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}
</style>
