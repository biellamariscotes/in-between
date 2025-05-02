<template>
  <div class="credit-actions">
    <img
      src="../../assets/img/buttons/credits/add.png"
      alt="all-in-png"
      class="insufficient"
      @click="() => emit('update:creditForm', true)"
    />
    <img
      src="../../assets/img/buttons/credits/no.png"
      alt="all-in-png"
      class="insufficient"
      @click="isCancelDialog = true"
    />

    <img
      src="../../assets/img/buttons/credits/cashin-fold.png"
      alt="ekis-btn"
      class="insufficient"
      @click="handleFoldTurn"
    />

    <!-- dialog box -->
    <PlayerQuitDialog v-model:isCancelDialog="isCancelDialog" />
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game-store'
// import { usePlayerRegistration } from '@/stores/player'
import { ref } from 'vue'
import PlayerQuitDialog from '../dialog/PlayerQuitDialog.vue'

const gameStore = useGameStore()
// const playerStore = usePlayerRegistration()

const emit = defineEmits(['update:creditForm'])
const isCancelDialog = ref(false)

const handleFoldTurn = () => {
  gameStore.fold()
}
</script>

<style scoped>
.insufficient {
  width: 100%;
  height: 40px;
}

.credit-actions img {
  width: 280px;
  height: 80px;
  cursor: pointer;
}
</style>
