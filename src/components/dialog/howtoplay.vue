<template>
  <!-- <el-space>
    <el-button id="btn1">Upload</el-button>
    <el-button id="btn2" type="primary">Save</el-button>
    <el-button ref="btnRef" :icon="MoreFilled" />
  </el-space> -->

  <el-tour v-model="open">
    <el-tour-step
      target="#btn1"
      title="START GAME"
      description="Press this button to kick off the game and begin the fun!"
    />
    <el-tour-step
      target="#btn2"
      title="CREDITS"
      description="Here you can view your available credits or balance for the game."
    />

    <el-tour-step
      target="#btn3"
      title="PLAYER"
      description="This is where your cards are displayed for easy viewing and strategic gameplay."
    />

    <el-tour-step
      target="#btn4"
      title="PLAYER CARD"
      description="This is where your cards are prominently displayed with an enhanced user interface for better visibility and interaction."
    />

    <el-tour-step
      target="#btn5"
      title="POT"
      description="This shows the total pot amount that every player is required to contribute to before gameplay proceeds."
    />

    <el-tour-step
      target="#btn6"
      title="TIMER"
      description="This 20-second timer allows you to carefully plan your next strategic move. If you don't make a decision within the time limit, the game will automatically fold your hand."
    />
  </el-tour>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  },
})

const open = ref(false)

watch(
  () => props.isOpen,
  (newValue) => {
    open.value = newValue
  },
  { immediate: true },
)
</script>
