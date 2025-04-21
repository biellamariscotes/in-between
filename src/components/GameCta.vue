<template>
  <div v-if="chooseBet" class="actions-wrapper">
    <el-form>
      <div class="slider-demo-block">
        <el-slider
          v-model="betAmount"
          :max="totalPot"
          show-input="true"
          :show-input-controls="false"
          :step="100"
        />
      </div>

      <img
        src="../assets/img/buttons/ekis.png"
        alt="back-btn"
        class="back-cta"
        @click="handleBackOption"
      />

      <img src="../assets/img/buttons/deal-now.png" alt="all-in-png" class="deal-cta" />
    </el-form>

    <div class="btn-wrapper">
      <Button variant="secondary" @click="handleMin">Min</Button>
      <Button variant="secondary" @click="handleHalf">Half</Button>
      <Button variant="secondary" @click="handleMax">Max</Button>
    </div>
  </div>

  <div v-else class="actions-wrapper">
    <div class="btn-wrapper">
      <img src="../assets/img/buttons/all-in.png" alt="all-in-png" class="all-in-cta" />
      <img
        src="../assets/img/buttons/bet.png"
        alt="all-in-png"
        class="bet-cta"
        @click="handleBetOption"
      />
      <img src="../assets/img/buttons/fold.png" alt="all-in-png" class="fold-cta" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '@/stores/game-store'

const chooseBet = ref(false)

const gameStore = useGameStore()
const totalPot = gameStore.getTotalPot
const betAmount = ref(0)

const handleBetOption = () => {
  chooseBet.value = true
}

const handleBackOption = () => {
  chooseBet.value = false
}

const handleMin = () => {
  //
  betAmount.value = 100
}

const handleHalf = () => {
  //
  betAmount.value = Math.floor(totalPot / 2)
}

const handleMax = () => {
  //
  betAmount.value = totalPot
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

.all-in-cta,
.fold-cta {
  width: 250px;
  height: 80px;
  cursor: pointer;
}

.bet-cta {
  width: 250px;
  height: 85px;
  margin-bottom: 5px;
  cursor: pointer;
}

.back-cta {
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.deal-cta {
  width: 235px;
  height: 85px;
  position: absolute;
  top: 40%;
  right: -45%;
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
</style>
