<!-- Credit Display Component
  Displays the current player's credit (pot) amount.

  Props:
    - gameStore: Game store instance (Pinia store)

  Features:
    - Cash-in/Cash-out

  Uses:
    - Computed property to safely retrieve player's pot amount.
-->

<template>
  <!-- Credit Display Container -->
  <div class="credit-display">
    <!-- Cash-in CTA Image -->
    <img src="../../assets/img/buttons/credits/cashin.png" alt="cash-in-png" class="cash-in-cta" />

    <!-- Current Player Pot Amount -->
    <p class="credit">₱ {{ currentPlayerPot }}</p>

    <!-- Future cash-out button -->

    <img
      src="../../assets/img/cash-out/cash-out.png"
      alt="cash-out-png"
      class="cash-out-cta"
      @click="handleCashOut"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * Props:
 */
const props = defineProps(['gameStore', 'cashOutCredit'])

const emit = defineEmits(['update:cashOutCredit'])

// ─────────────────────────────
// Computed Properties
// ─────────────────────────────

/**
 * Retrieves the current player's pot amount.
 * Returns 0 if game isn't started or index is invalid.
 */
const currentPlayerPot = computed(() => {
  if (!props.gameStore.gameStarted) return 0

  // Validate index and player pots array
  if (
    props.gameStore.playerPots &&
    props.gameStore.currentPlayerIndex >= 0 &&
    props.gameStore.playerPots.length > props.gameStore.currentPlayerIndex
  ) {
    return props.gameStore.playerPots[props.gameStore.currentPlayerIndex]
  }

  return 0
})

// ─────────────────────────────
// Event Handlers (for future use)
// ─────────────────────────────

const handleCashOut = () => {
  console.log('hello cash out', props.cashOutCredit)
  emit('update:cashOutCredit', true)
}
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
