<template>
  <!-- dialog box -->
  <el-dialog v-model="dialogVisible" title="Warning" width="500" align-center>
    <div class="dialog-msg">
      <img src="../../assets/img/cash-out/quit-title.png" alt="quit-img" class="quit-btn" />

      <img src="../../assets/img/cash-out/quit-description.png" alt="no-img" class="no-btn" />
    </div>

    <!-- controls -->
    <template #footer>
      <div class="dialog-footer">
        <img
          src="../../assets/img/cash-out/quit-game.png"
          alt="quit-img"
          class="quit-btn"
          @click="isQuitPlayer"
        />

        <img
          src="../../assets/img/cash-out/no-add.png"
          alt="no-img"
          class="no-btn"
          @click="closeDialog"
        />
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game-store'
import { usePlayerRegistration } from '@/stores/player'
import { computed } from 'vue'
import { inject } from 'vue'

const gameStore = useGameStore()
const playerStore = usePlayerRegistration()

const props = defineProps(['isCancelDialog'])
const emit = defineEmits(['update:isCancelDialog'])

const handleBackToMainCta = inject('addCredit') as () => void

// Create computed property for two-way binding
const dialogVisible = computed({
  get: () => props.isCancelDialog,
  set: (value) => emit('update:isCancelDialog', value),
})

// Function to close dialog - now properly updates parent's ref
const closeDialog = () => {
  emit('update:isCancelDialog', false)
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

      emit('update:isCancelDialog', false)

      gameStore.startTurnTimer()

      handleBackToMainCta()
    }
  } catch (error) {
    console.error('Error removing player:', error)
  }
}
</script>

<style scoped>
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
</style>
