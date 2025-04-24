<template>
  <!-- Replace game message with player credit display -->
  <div class="credit-display">
    <img src="../../assets/img/buttons/credits/cashin.png" alt="all-in-png" class="cash-in-cta" />
    <p class="credit">₱ {{ currentPlayerPot }}</p>

    <!-- <img
      src="../assets/img/cash-out/cash-out.png"
      alt="all-in-png"
      class="cash-out-cta"
      @click="handleCashOut"
    /> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps(['gameStore'])

// Current player's pot amount
const currentPlayerPot = computed(() => {
  if (!props.gameStore.gameStarted) return 0

  // Make sure we have a valid index and value
  if (
    props.gameStore.playerPots &&
    props.gameStore.currentPlayerIndex >= 0 &&
    props.gameStore.playerPots.length > props.gameStore.currentPlayerIndex
  ) {
    return props.gameStore.playerPots[props.gameStore.currentPlayerIndex]
  }

  return 0
})

// const handleCashOut = () => {
//   console.log('hello cash out')
// }
</script>

<style scoped>
.credit-display {
  position: relative;
  color: white;
  text-align: center;
  border-radius: 5px;
  font-weight: bold;
  z-index: 900;
}

.credit {
  position: absolute;
  top: 48%;
  left: 40%;
  transform: translate(-50%, -50%);

  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;

  font-size: 14px;
}

.cash-out-cta {
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.cash-in-cta {
  width: 100%;
  height: 100%;
}

.cash-out-cta {
  width: 140px;
  cursor: pointer;
}
</style>
