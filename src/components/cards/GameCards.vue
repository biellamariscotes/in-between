<!-- Game Zone Component
  Renders the main card display area during a game round.

  Props:
    - leftCard: string — Card ID for the left face-up card.
    - middleCard: string — Card ID for the middle card.
    - rightCard: string — Card ID for the right face-up card.
    - showMiddleCard: boolean — Controls visibility of middle card.
    - playerCredit: number — Current player’s credit (unused in template but passed in).
    
  Features:
    - Dynamically displays PlayerHand components for face-up cards.
    - Displays placeholder when middle card is hidden.
    - Integrates CashFlow component for credit display.
-->

<template>
  <div class="game-zone">
    <div class="card-table">
      <!-- Card display area -->
      <div class="game-cards">
        <!-- Left face-up card -->
        <div class="face-up-card" v-if="leftCard">
          <PlayerHand :cards="[leftCard]" :show-cards="true" orientation="normal" />
        </div>

        <!-- Middle face-up card or placeholder -->
        <div class="face-up-card" v-if="showMiddleCard">
          <PlayerHand :cards="[middleCard]" :show-cards="true" orientation="normal" />
        </div>
        <div class="face-up-card" v-else>
          <div class="card-placeholder"></div>
        </div>

        <!-- Right face-up card -->
        <div class="face-up-card" v-if="rightCard">
          <PlayerHand :cards="[rightCard]" :show-cards="true" orientation="normal" />
        </div>
      </div>

      <!-- CashFlow component for credit display -->
      <CashFlow :gameStore="gameStore" />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Script setup section
 */
import { defineProps } from 'vue'
import { useGameStore } from '@/stores/game-store'
import PlayerHand from '@/components/game-table/PlayerHand.vue'

/**
 * Inject game store for shared state access.
 */
const gameStore = useGameStore()

/**
 * Props
 */
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
