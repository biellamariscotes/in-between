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
      @click="noIllAdd"
    />

    <img
      src="../../assets/img/buttons/actions/ekis.png"
      alt="ekis-btn"
      class="back-cta"
      @click="handleBackToMainCta"
    />

    <!-- dialog box -->
    <PlayerQuitDialog v-model:isCancelDialog="isCancelDialog" />
  </div>
</template>

<script setup lang="ts">
// import { usePlayerRegistration } from '@/stores/player'
import { ref } from 'vue'
import PlayerQuitDialog from '../dialog/PlayerQuitDialog.vue'
import { inject } from 'vue'

// const playerStore = usePlayerRegistration()

const emit = defineEmits(['update:creditForm', 'update:addCredit'])
const isCancelDialog = ref(false)
const handleBackToMainCta = inject('addCredit') as () => void

const noIllAdd = () => {
  isCancelDialog.value = true
}
</script>

<style scoped>
.insufficient {
  cursor: pointer;
  width: 230px;
  height: 100px;
  @media screen and (orientation: landscape) and (max-width: 932px) and (max-height: 430px) {
    width: 130px;
    height: 50px;
  }
}

.back-cta {
  position: absolute;
  top: 15%;
  left: 3%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  @media screen and (orientation: landscape) and (max-width: 932px) and (max-height: 430px) {
    width: 20px;
    height: 20px;
  }
}
</style>
