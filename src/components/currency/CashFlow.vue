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
    <img
      src="../../assets/img/buttons/credits/cashin.png"
      alt="cash-in-png"
      id="btn2"
      class="cash-in-cta"
      @click="handleCashInCredit"
    />

    <!-- Current Player Pot Amount -->
    <p class="credit">₱ {{ currentPlayerPot.toLocaleString() }}</p>

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
const props = defineProps(['gameStore', 'cashOutCredit', 'handleCashInCredit'])

const emit = defineEmits(['update:cashOutCredit'])

// ─────────────────────────────
// Computed Properties
// ─────────────────────────────

/**
 * Retrieves the current player's pot amount.
 * Returns 0 if game isn't started or index is invalid.
 */
const currentPlayerPot = computed(() => {
  console.log('Game started:', props.gameStore.gameStarted)
  console.log('Current player index:', props.gameStore.currentPlayerIndex)
  console.log('Players:', props.gameStore.players)

  if (!props.gameStore.gameStarted) {
    console.log('Game not started, returning 0')
    return 0
  }

  const currentPlayer = props.gameStore.players[props.gameStore.currentPlayerIndex]
  if (
    currentPlayer &&
    props.gameStore.currentPlayerIndex >= 0 &&
    props.gameStore.players.length > props.gameStore.currentPlayerIndex
  ) {
    console.log('Current player:', currentPlayer)
    console.log('Current player credit:', currentPlayer.credits)
    return currentPlayer.credits !== undefined ? currentPlayer.credits : 0
  }

  console.log('Invalid player index or player data, returning 0')
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

  /* Responsive sizing for different screen sizes */
  @media screen and (max-width: 768px) {
    transform: scale(0.9);
  }

  @media screen and (max-width: 480px) {
    transform: scale(0.85);
  }

  /* Landscape orientation adjustments */
  @media screen and (orientation: landscape) and (max-height: 600px) {
    transform: scale(0.8);
  }

  /* iPhone specific landscape adjustments */
  @media screen and (orientation: landscape) and (max-width: 932px) and (max-height: 430px) {
    transform: scale(0.75);
  }
}

.credit {
  position: absolute;
  top: 48%;
  left: 35%;
  transform: translate(-50%, -50%);

  display: flex;
  justify-content: space-around;
  align-items: center;

  font-size: 14px;

  /* Responsive font size for smaller screens */
  @media screen and (max-width: 768px) {
    font-size: 13px;
  }

  @media screen and (max-width: 480px) {
    font-size: 12px;
  }

  @media screen and (orientation: landscape) and (max-height: 600px) {
    font-size: 11px;
  }

  @media screen and (orientation: landscape) and (max-width: 932px) and (max-height: 430px) {
    font-size: 10px;
  }
}

.cash-out-cta {
  position: absolute;
  top: 85%;
  left: 50%;
  transform: translate(-50%);
}

.cash-in-cta {
  width: 120px;
  cursor: pointer;

  /* Responsive sizing for different screen sizes */
  @media screen and (max-width: 768px) {
    width: 110px;
  }

  @media screen and (max-width: 480px) {
    width: 100px;
  }

  @media screen and (orientation: landscape) and (max-height: 600px) {
    width: 95px;
  }

  @media screen and (orientation: landscape) and (max-width: 932px) and (max-height: 430px) {
    width: 85px;
  }
}

.cash-out-cta {
  width: 100px;
  cursor: pointer;

  /* Responsive sizing for different screen sizes */
  @media screen and (max-width: 768px) {
    width: 90px;
  }

  @media screen and (max-width: 480px) {
    width: 80px;
  }

  @media screen and (orientation: landscape) and (max-height: 600px) {
    width: 75px;
  }

  @media screen and (orientation: landscape) and (max-width: 932px) and (max-height: 430px) {
    width: 65px;
  }
}
</style>
