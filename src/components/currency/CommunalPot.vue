<!-- Pot Amount Display Component
  Displays the current total pot amount in the game.
  Props:
    - potAmount: number — The current amount in the pot.
    - currentBet: number — The current bet amount (currently unused in template).

  Features:
    - Shows a pot image and the total pot value.

  Uses:
    - Static image asset for the pot visual.
-->

<template>
  <div id="btn5" class="pot-amount">
    <!-- Pot Image -->
    <img class="pot-amount__img" :src="PotAmount" alt="Pot Amount" />

    <!-- Pot Value Display -->
    <div class="pot-amount__value">
      <span class="pot-amount__value--total">{{ potAmount.toLocaleString() }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import PotAmount from '@/assets/img/game-zone/currency/pot-amount.png'

/**
 * Props
 */
defineProps<{
  potAmount: number
  currentBet: number
}>()
</script>

<style scoped lang="scss">
.pot-amount {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &__img {
    width: 100%;
    height: 100%;
  }

  &__value {
    font-size: 1.3rem;
    font-weight: bold;
    color: #fff;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 30%;
    top: -5%;

    &--total {
      color: #ffcc00;
      width: 100%;
      @media screen and (orientation: landscape) and (max-width: 932px) and (max-height: 430px) {
        font-size: 0.6rem;
      }
    }
  }
}
</style>
