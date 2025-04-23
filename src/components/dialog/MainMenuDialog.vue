<template>
  <el-dialog v-model="mainMenuVisible" title="Warning" width="500" align-center>
    <h1>Main Menu</h1>
    <Button variant="secondary">Half</Button>
    <Button variant="secondary" @click="startNewGame">Quit Game</Button>
    <button @click="closeMainMenu">Close</button>
    <template #footer>
      <div class="dialog-footer"></div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useGameLifeCycle } from '@/composables/useGameLifeCycle'
import eventBus from '@/eventBus'

const mainMenuVisible = ref(false)
const { startNewGame } = useGameLifeCycle()

const closeMainMenu = () => {
  mainMenuVisible.value = false
}

onMounted(() => {
  eventBus.on('toggle-main-menu', () => {
    mainMenuVisible.value = true
  })
})

onUnmounted(() => {
  eventBus.off('toggle-main-menu')
})

watch(mainMenuVisible, (newValue) => {
  eventBus.emit('untoggle-main-menu', newValue)
})
</script>
