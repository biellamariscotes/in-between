<!-- BetDialog Component
  Displays a betting interface with slider and quick bet options.
  
  Emits:
    - update:chooseBet: boolean — Controls the visibility of the betting dialog.
    - close-bet: void — Triggered when dialog should be closed.

  Uses:
    - Element Plus components for form and slider UI.
    - Custom Button component for quick bet options.
    - Game store for player data and game state management.

  Features:
    - Slider-based bet amount selection with input field.
    - Quick betting options (Min, Half, Max).
    - Validation to ensure bets are within allowed limits.
-->

<template>
  <el-form>
    <!-- Slider -->
    <div class="slider-demo-block">
      <el-slider
        v-model="betAmount"
        :min="minBet"
        :max="maxAllowedBet"
        show-input="true"
        :show-input-controls="false"
        :step="100"
      />
    </div>

    <!-- Close Button -->
    <img
      src="../../assets/img/buttons/actions/ekis.png"
      alt="back-btn"
      class="back-cta"
      @click="closeBet"
    />

    <!-- Automatic Deal Now -->
    <img
      src="../../assets/img/buttons/actions/deal-now.png"
      alt="deal-now-btn"
      class="deal-cta"
      @click="handleDealNow"
    />
  </el-form>

  <!-- CTA Buttons: Min, Half, Max -->
  <div class="btn-wrapper">
    <Button variant="secondary" @click="handleMin">Min</Button>
    <Button variant="secondary" @click="handleHalf">Half</Button>
    <Button variant="secondary" @click="handleMax">Max</Button>
  </div>
</template>

<script setup lang="ts">
/**
 * Script setup section
 */
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/game-store'
import { ElMessage } from 'element-plus'

/**
 * Emits
 */
const emit = defineEmits(['update:chooseBet', 'close-bet'])

/**
 * Store
 */
const gameStore = useGameStore()
const minBet = 100 // Minimum bet amount

// ─────────────────────────────
// Event Handlers
// ─────────────────────────────

/**
 * Closes the betting dialog and updates parent component state
 */
const closeBet = () => {
  emit('close-bet')
  emit('update:chooseBet', false)
}

// ─────────────────────────────
// Computed Properties
// ─────────────────────────────

/**
 * Player's available credits - simplified calculation
 */
const playerCredits = computed(() => {
  return gameStore.players[gameStore.currentPlayerIndex].credits || 0
})

/**
 * Calculates the maximum allowed bet based on player credits and communal pot
 * Returns the smaller of the two limits
 */
const maxAllowedBet = computed(() => {
  const potLimit = gameStore.communalPot || 0
  const creditLimit = playerCredits.value

  return Math.min(potLimit, creditLimit)
})

/**
 * Reactive Refs
 */
const betAmount = ref(minBet)

// ─────────────────────────────
// Quick Bet Methods
// ─────────────────────────────

/**
 * Sets bet amount to minimum allowed value
 */
const handleMin = () => {
  betAmount.value = minBet
}

/**
 * Sets bet amount to half of player credits or half of pot (whichever is smaller)
 * Ensures the bet isn't below minimum
 */
const handleHalf = () => {
  // Calculate half of player's credits and half of communal pot
  const halfPlayerCredits = Math.floor(playerCredits.value / 2)
  const halfPotAmount = Math.floor(gameStore.communalPot / 2)

  // Use the smaller value between half of player credits and half of pot
  betAmount.value = Math.min(halfPlayerCredits, halfPotAmount)

  // Ensure bet is not below minimum
  if (betAmount.value < minBet) {
    betAmount.value = minBet
  }
}

/**
 * Sets bet amount to maximum allowed value
 */
const handleMax = () => {
  betAmount.value = maxAllowedBet.value
}

/**
 * Handles the deal now action with validation
 * Places bet and draws card if valid, otherwise shows error message
 */
const handleDealNow = () => {
  if (betAmount.value <= 0) {
    ElMessage.warning('Please enter a valid bet amount')
    return
  }

  if (betAmount.value > maxAllowedBet.value) {
    ElMessage.warning('Bet cannot exceed the communal pot or your available credits')
    return
  }

  gameStore.checkForEqualCardsAndProcess()

  // Place bet and draw card
  gameStore.placeBet(betAmount.value)
  gameStore.drawThirdCard()

  // Emit an event to notify the parent to update `chooseBet`
  emit('update:chooseBet', false)
}
</script>
<style scoped>
.actions-wrapper {
  position: relative;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 5rem;
  gap: 20px;
  z-index: 999;
}

.el-form,
.btn-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.back-cta {
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.deal-cta {
  margin-top: 15px;
  width: 220px;
  height: 50px;

  cursor: pointer;
}

.el-input {
  max-width: 250px;
  width: 150px;
}

.slider-demo-block {
  width: 100%;
}

:deep(.el-input) {
  width: 120px;
}

:deep(.el-slider) {
  display: flex;
  flex-direction: row-reverse;
  gap: 20px;
}

:deep(.el-input__wrapper) {
  box-shadow: none;
  background-color: black;
}

:deep(.el-input__inner) {
  color: white;
  font-family: 'Baumans';
}

:deep(.el-slider__bar) {
  background-color: #ffd700;
  @media (max-width: 932px) and (max-height: 430px) {
    width: 150px;
  }
}
:deep(.el-slider__runway) {
  @media (max-width: 932px) and (max-height: 430px) {
    width: 150px;
  }
}
@media screen and (max-width: 932px) and (max-height: 430px) {
  .el-input-number {
    width: 100px;
  }
  :deep(.el-slider__input) {
    width: 80px;
  }
  :deep(.el-slider__runway.show-input) {
    margin-right: 0px;
  }
}

:deep(.el-slider__button) {
  background-color: black;
  border: none;
}

/* Dialog styling enhancements */
.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

:deep(.game-dialog) {
  display: flex;
  align-items: center;
  justify-items: center;
  align-content: center;
  justify-content: center;
  border-radius: 10px;
}

:deep(.el-dialog) {
  display: flex !important;
  flex-direction: column;
  margin: 0 auto !important;
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}

:deep(.el-dialog__header) {
  margin: 0;
  text-align: center;
  font-weight: bold;
  padding-top: 20px;
  font-family: 'Baumans', sans-serif;
}

:deep(.el-dialog__body) {
  text-align: center;
  padding: 20px;
  font-family: 'Baumans', sans-serif;
}

:deep(.dialog-overlay) {
  background-color: rgba(0, 0, 0, 0.8) !important;
  backdrop-filter: blur(3px);
}

:deep(.el-button) {
  font-family: 'Baumans', sans-serif;
  min-width: 100px;
}

:deep(.el-overlay) {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  overflow: auto;
  display: flex;
  align-items: center;
  justify-items: center;
  align-content: center;
  justify-content: center;
}

/* Add media queries for mobile landscape orientation */
@media (max-width: 932px) and (max-height: 430px) {
  .actions-wrapper {
    padding: 2rem;
    gap: 10px;
  }

  .back-cta {
    width: 30px;
    height: 30px;
  }

  .deal-cta {
    width: 180px;
    height: 40px;
  }

  .el-input {
    max-width: 200px;
    width: 120px;
  }

  :deep(.el-input) {
    width: 100px;
  }

  :deep(.el-slider) {
    gap: 10px;
  }

  .dialog-footer {
    gap: 10px;
  }

  :deep(.el-button) {
    min-width: 80px;
  }
}
</style>
