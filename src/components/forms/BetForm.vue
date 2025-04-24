<template>
  <el-form>
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

    <img
      src="../../assets/img/buttons/actions/ekis.png"
      alt="back-btn"
      class="back-cta"
      @click="closeBet"
    />

    <img
      src="../../assets/img/buttons/actions/deal-now.png"
      alt="deal-now-btn"
      class="deal-cta"
      @click="handleDealNow"
    />
  </el-form>

  <div class="btn-wrapper">
    <Button variant="secondary" @click="handleMin">Min</Button>
    <Button variant="secondary" @click="handleHalf">Half</Button>
    <Button variant="secondary" @click="handleMax">Max</Button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/game-store'
import { ElMessage } from 'element-plus'

const gameStore = useGameStore()
const minBet = 100 // Minimum bet amount
// const { getCurrentPlayer } = usePlayerRandomizer()
const emit = defineEmits(['closeBet', 'update:chooseBet'])

const closeBet = () => {
  emit('closeBet')
}

// Player's available credits
const playerCredits = computed(() => {
  if (gameStore.isMultiplayer) {
    return gameStore.playerPots[gameStore.currentPlayerIndex] || 0
  }
  return gameStore.pot || 0
})

const maxAllowedBet = computed(() => {
  const potLimit = gameStore.communalPot || 0
  const creditLimit = playerCredits.value

  // Return the smaller of the two limits
  return Math.min(potLimit, creditLimit)
})

const betAmount = ref(minBet)

const handleMin = () => {
  betAmount.value = minBet
}

const handleHalf = () => {
  // Use only the first value in the playerPots array
  betAmount.value = Math.floor(gameStore.communalPot / 2)

  if (betAmount.value > playerCredits.value) {
    betAmount.value = playerCredits.value
  }

  if (betAmount.value < minBet) {
    betAmount.value = minBet
  }
}

const handleMax = () => {
  betAmount.value = maxAllowedBet.value
}

const handleDealNow = () => {
  if (betAmount.value <= 0) {
    ElMessage.warning('Please enter a valid bet amount')
    return
  }

  if (betAmount.value > maxAllowedBet.value) {
    ElMessage.warning('Bet cannot exceed the communal pot or your available credits')
    return
  }

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
</style>
