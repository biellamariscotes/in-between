<template>
  <div class="pot-amount">
    <h1 class="border">
      POT AMOUNT:
      {{ potAmount }}
    </h1>
    <h2 v-if="currentBet > 0" class="border">
      CURRENT BET: {{ currentBet }}
    </h2>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{
  potAmount: number
  currentBet: number
}>()
</script>
