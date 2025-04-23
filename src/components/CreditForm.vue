<template>
  <div v-if="creditForm" class="credit-form-wrapper">
    <el-form>
      <img
        src="../assets/img/buttons/input-credits.png"
        alt="input-text"
        class="input-credits-text"
      />

      <el-input size="large" v-model="creditValue" />

      <img
        src="../assets/img/buttons/add-credits.png"
        alt="add-btn"
        class="add-credits-cta"
        @click="handleSubmitCredit"
      />

      <img
        src="../assets/img/buttons/ekis.png"
        alt="ekis-btn"
        class="back-cta"
        @click="handleBackToAddCredit"
      />
    </el-form>
  </div>

  <div v-else class="insufficient-wrapper">
    <div class="credit-wrapper">
      <img src="../assets/img/buttons/insufficient.png" alt="all-in-png" class="insufficient" />
    </div>

    <div class="credit-actions">
      <img
        src="../assets/img/buttons/add.png"
        alt="all-in-png"
        class="insufficient"
        @click="handleAddCredit"
      />
      <img
        src="../assets/img/buttons/no.png"
        alt="all-in-png"
        class="insufficient"
        @click="handleCancelCredit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '@/stores/game-store'
import { usePlayerRegistration } from '@/stores/player'

// const showAllInConfirmation = ref(false)
const creditValue = ref(0)
const gameStore = useGameStore()
const playerStore = usePlayerRegistration()

const creditForm = ref(false)

const handleAddCredit = () => {
  creditForm.value = true
}

const handleBackToAddCredit = () => {
  creditForm.value = false
}

const handleCancelCredit = () => {
  // Close or navigate away from the credit form
  const emit = defineEmits(['close-credit'])
  emit('close-credit')
}

const handleSubmitCredit = () => {
  // Ensure a valid amount is entered
  if (creditValue.value <= 0) return

  try {
    const index = gameStore.currentPlayerIndex
    
    // Update in-game credits
    if (!gameStore.playerPots[index]) {
      gameStore.playerPots[index] = 0
    }
    gameStore.playerPots[index] += Number(creditValue.value)
    
    // Update player registration store
    const playerId = gameStore.players[index]?.id
    if (playerId) {
      const playerIndex = playerStore.players.findIndex(p => p.id === playerId)
      if (playerIndex !== -1) {
        const currentCredits = playerStore.players[playerIndex].credits || 0
        playerStore.players[playerIndex].credits = currentCredits + Number(creditValue.value)
      }
    }

    // Save updated player data to localStorage
    localStorage.setItem('players', JSON.stringify(playerStore.players))
    
    // Update game state in localStorage
    gameStore.saveStateToLocalStorage()
    
    // Reset the form and hide it
    creditValue.value = 0
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
  right: -20%;
  width: 190px;
  height: 60px;
  cursor: pointer;
}

.insufficient-wrapper {
  width: 100%;
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

.credit-actions img {
  width: 280px;
  height: 80px;
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
