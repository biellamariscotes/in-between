<template>
  <!-- credit form -->
  <div v-if="creditForm" class="credit-form-wrapper">
    <el-form @submit.prevent="handleSubmitCredit">
      <img
        src="../../assets/img/buttons/credits/input-credits.png"
        alt="input-text"
        class="input-credits-text"
      />

      <el-input size="large" placeholder="Input Credits..." v-model="creditValue" />

      <img
        src="../../assets/img/buttons/credits/add-credits.png"
        alt="add-btn"
        class="add-credits-cta"
        @click="handleSubmitCredit"
      />

      <img
        src="../../assets/img/buttons/actions/ekis.png"
        alt="ekis-btn"
        class="back-cta"
        @click="handleBackToAddCredit"
      />
    </el-form>
  </div>

  <!-- credit homepage -->
  <div v-else class="insufficient-wrapper">
    <div class="credit-wrapper">
      <img
        src="../../assets/img/buttons/credits/insufficient.png"
        alt="all-in-png"
        class="insufficient"
      />
    </div>

    <CreditActions :creditForm="creditForm" @update:credit-form="handleAddCredit" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '@/stores/game-store'
import { usePlayerRegistration } from '@/stores/player'
import CreditActions from '../currency/CreditActions.vue'
import { useNotification } from '@/composables/game/useNotification'

// const showAllInConfirmation = ref(false)
const creditValue = ref()
const gameStore = useGameStore()
const playerStore = usePlayerRegistration()

const creditForm = ref(false)
const { showNotification } = useNotification()

const handleAddCredit = () => {
  creditForm.value = true
}

const handleBackToAddCredit = () => {
  creditForm.value = false
}

const handleSubmitCredit = () => {
  // Ensure a valid amount is entered
  if (creditValue.value <= 0) return

  try {
    const index = gameStore.currentPlayerIndex

    if (!gameStore.players[index]) {
      gameStore.players[index] = {
        id: '',
        name: '',
        credits: 0,
        randomizedPosition: 0,
        isTurn: false,
        isTurnComplete: false,
      }
    }

    // Update in-game credits

    gameStore.players[index].credits =
      (gameStore.players[index].credits ?? 0) + Number(creditValue.value)

    // Update player registration store
    const playerId = gameStore.players[index]?.id
    if (playerId) {
      const playerIndex = playerStore.players.findIndex((p) => p.id === playerId)
      if (playerIndex !== -1) {
        const currentCredits = playerStore.players[playerIndex].credits || 0
        playerStore.players[playerIndex].credits = currentCredits + Number(creditValue.value)
      }
    }

    // Save updated player data to localStorage
    localStorage.setItem('players', JSON.stringify(playerStore.players))

    // Update game state in localStorage
    gameStore.saveStateToLocalStorage()

    showNotification({
      title: 'Player Cash-In',
      message: `Player Cash-in ${creditValue.value}`,
      type: 'success',
    })

    creditValue.value = null
    creditForm.value = false
  } catch (error) {
    console.error('Error adding credits:', error)
  }
}
</script>

<style scoped>
.el-form {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
}

.input-credits-text {
  width: 250px;
  height: 50px;
}

.back-cta {
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.add-credits-cta {
  position: absolute;
  top: 30%;
  right: -50%;
  width: 190px;
  height: 60px;
  cursor: pointer;
}

.insufficient-wrapper {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  padding: 1rem 2rem;
}

.credit-wrapper {
  width: 100%;
}

.insufficient {
  width: 100%;
  height: 40px;
}

.credit-actions {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.back {
  position: absolute;
  top: 0;
  left: -5%;
  width: 30px !important;
  height: 30px !important;
  cursor: pointer;
}

:deep(.el-input) {
  width: 150px;
}

:deep(.el-input__wrapper) {
  box-shadow: none;
  background-color: black;
}

:deep(.el-input__inner) {
  color: white;
  font-family: 'Baumans';
}
</style>
