<!-- Main Menu Component
  Displays the main menu dialog.
  
  Features:
    - Contains buttons for navigating the menu, closing the menu, and restarting the game.
    - Uses event bus for showing and hiding the menu.
    - Dynamically updates based on the visibility of the menu.
-->

<template>
  <el-dialog v-model="mainMenuVisible" title="Warning" width="500" align-center>
    <!-- Close button -->
    <el-row justify="end" :gutter="24">
      <el-col :span="4">
        <img
          src="../../assets/img/buttons/actions/ekis.png"
          alt="back-btn"
          class="close-btn"
          @click="closeMainMenu"
        />
      </el-col>
    </el-row>

    <!-- Title section -->
    <el-row justify="center" :gutter="24">
      <el-col :span="26"><p class="title-main-menu">Main Menu</p></el-col>
    </el-row>

    <!-- Menu buttons -->
    <div class="menu-btn-cont">
      <img
        src="../../assets/img/buttons/main-menu/how-to-play.png"
        alt="deal-now-btn"
        class="main-menu-btns"
      />
      <img
        src="../../assets/img/buttons/main-menu/restart-game.png"
        alt="how-to-play-btn"
        class="main-menu-btns"
        @click="startNewGame"
      />
    </div>

    <!-- Footer section (empty) -->
    <template #footer>
      <div class="dialog-footer"></div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
/**
 * Script setup section
 */
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useGameLifeCycle } from '@/composables/useGameLifeCycle'
import eventBus from '@/eventBus'

/**
 * Reactive state to control the visibility of the main menu dialog.
 */
const mainMenuVisible = ref(false)

/**
 * Game lifecycle management hook to handle restarting the game.
 */
const { startNewGame } = useGameLifeCycle()

/**
 * Closes the main menu dialog.
 */
const closeMainMenu = () => {
  mainMenuVisible.value = false
}

/**
 * Event handling
 */
onMounted(() => {
  eventBus.on('toggle-main-menu', () => {
    mainMenuVisible.value = true
  })
})

onUnmounted(() => {
  eventBus.off('toggle-main-menu')
})

/**
 * Watches the visibility of the main menu and emits an event accordingly.
 */
watch(mainMenuVisible, (newValue) => {
  eventBus.emit('untoggle-main-menu', newValue)
})
</script>

<style scoped>
.main-menu-btns {
  width: 70%;
  cursor: pointer;
  padding-bottom: 16px;
}

.title-main-menu {
  margin-bottom: 0;
  font-size: 4rem;
  padding-bottom: 0.5em;
  color: #000;
}

.close-btn {
  padding-top: 1em;
  width: 40%;
  cursor: pointer;
}

.menu-btn-cont {
  align-items: center;
  display: flex;
  flex-direction: column;
}

.el-dialog__header.show-close {
  padding-right: 0;
}
</style>
