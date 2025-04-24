<template>
  <!-- credit form -->
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

  <!-- credit homepage -->
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

      <!-- dialog box -->
      <el-dialog v-model="isCancelDialog" title="Warning" width="500" align-center>
        <div class="dialog-msg">
          <img src="../assets/img/cash-out/quit-title.png" alt="quit-img" class="quit-btn" />

          <img src="../assets/img/cash-out/quit-description.png" alt="no-img" class="no-btn" />
        </div>

        <!-- controls -->
        <template #footer>
          <div class="dialog-footer">
            <img
              src="../assets/img/cash-out/quit-game.png"
              alt="quit-img"
              class="quit-btn"
              @click="isQuitPlayer"
            />

            <img
              src="../assets/img/cash-out/no-add.png"
              alt="no-img"
              class="no-btn"
              @click="isCancelDialog = false"
            />
          </div>
        </template>
      </el-dialog>
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
const isCancelDialog = ref(false)

const handleAddCredit = () => {
  creditForm.value = true
}

const handleBackToAddCredit = () => {
  creditForm.value = false
}

const handleCancelCredit = () => {
  isCancelDialog.value = true
}

const isQuitPlayer = () => {
  try {
    const index = gameStore.currentPlayerIndex
    const playerId = gameStore.players[index]?.id

    if (playerId) {
      playerStore.players = playerStore.players.filter((p) => p.id !== playerId)

      localStorage.setItem('players', JSON.stringify(playerStore.players))

      gameStore.players.splice(index, 1)

      gameStore.saveStateToLocalStorage()

      isCancelDialog.value = false

      // gameStore.currentPlayerIndex = null
    }
  } catch (error) {
    console.error('Error removing player:', error)
  }
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

.dialog-msg {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dialog-msg img {
  width: 100%;
  height: 60px;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-footer img {
  width: 250px;
  height: 90px;
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
