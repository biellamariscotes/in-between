<template>
  <div v-if="chooseBet" class="actions-wrapper">
    <BetForm @close-bet="handeBackOption" v-model:chooseBet="chooseBet" />
  </div>

  <div v-else class="actions-wrapper">
    <div v-if="props.addCredit" class="btn-wrapper">
      <img
        src="../../assets/img/buttons/all-in.png"
        alt="all-in-png"
        class="all-in-cta"
        @click="handleAllIn"
      />

      <!-- Bet -->
      <img
        src="../../assets/img/buttons/bet.png"
        alt="bet-btn"
        class="bet-cta"
        @click="handleBetOption"
      />

      <!-- Fold -->
      <img
        src="../../assets/img/buttons/fold.png"
        alt="fold-btn"
        class="fold-cta"
        @click="handleFold"
      />
    </div>

    <!--  CashIn/CashOut -->
    <div v-else class="credit">
      <CreditForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/game-store'

const chooseBet = ref(false)
// const showAllInConfirmation = ref(false)
const props = defineProps(['addCredit'])

const gameStore = useGameStore()
const minBet = 100 // Minimum bet amount

// Player's available credits
const playerCredits = computed(() => {
  if (gameStore.isMultiplayer) {
    return gameStore.playerPots[gameStore.currentPlayerIndex] || 0
  }
  return gameStore.pot || 0
})

const handleAllIn = () => {
  gameStore.placeBet(playerCredits.value)
  gameStore.drawThirdCard()
}

const betAmount = ref(minBet)

const handleBetOption = () => {
  chooseBet.value = true
  betAmount.value = minBet
}

const handeBackOption = () => {
  chooseBet.value = false
}

const handleFold = () => {
  gameStore.fold()
}
</script>

<style lang="css" scoped>
.actions-wrapper {
  position: relative;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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

.credit-form-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.insufficient-wrapper {
  width: 100%;
}

.input-credits-text {
  width: 250px;
  height: 50px;
}

.all-in-cta,
.fold-cta {
  margin-top: 20px;
  width: 250px;
  height: 80px;
  cursor: pointer;
}

.bet-cta {
  margin-top: 20px;
  width: 250px;
  height: 85px;
  margin-bottom: 5px;
  cursor: pointer;
}

.back-cta {
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 30px;
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

.credit {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.insufficient {
  width: 100%;
  height: 40px;
}

.credit-wrapper {
  width: 100%;
}

.credit-actions {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.credit-actions img {
  width: 280px;
  height: 70px;
  cursor: pointer;
}

.add-credits-cta {
  position: absolute;
  top: 30%;
  right: -20%;
  width: 190px;
  height: 60px;
  cursor: pointer;
}

:deep(.el-input) {
  width: 150px;
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
