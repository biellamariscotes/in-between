<template>
  <el-dialog v-model="mainMenuVisible" title="Warning" width="500" align-center>
    <h1>Main Menu</h1>
    <button class="game-button choice-button">How To Play</button>
    <button class="game-button choice-button" @click="startNewGame">New Game</button>
    <template #footer>
      <div class="dialog-footer"></div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useGameLifeCycle } from '@/composables/useGameLifeCycle'
import eventBus from '@/eventBus'

const mainMenuVisible = ref(false)
const { startNewGame } = useGameLifeCycle()

onMounted(() => {
  eventBus.on('toggle-main-menu', () => {
    mainMenuVisible.value = true
    console.log('Main Menu Open')
  })
})
</script>
