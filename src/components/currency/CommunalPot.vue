<template>
  <div class="pot-amount">
    <img class="pot-amount__img" :src="PotAmount" alt="Pot Amount" />
    <div class="pot-amount__value">
      <span class="pot-amount__value--total">{{ potAmount }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import PotAmount from '@/assets/img/game-zone/currency/pot-amount.png'
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
  margin-top: 1rem;

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
    }
  }
}
</style>
