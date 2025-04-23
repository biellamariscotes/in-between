<template>
  <el-dialog v-model="mainMenuVisible" title="Warning" width="500" align-center>
    <el-row justify="end" :gutter="24">
      <el-col :span="4">
        <img
          src="../../assets/img/buttons/ekis.png"
          alt="back-btn"
          class="close-btn"
          @click="closeMainMenu"
        />
      </el-col>
    </el-row>

    <el-row justify="center" :gutter="24">
      <el-col :span="26"><p class="title-main-menu">Main Menu</p></el-col>
    </el-row>

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
