<template>
  <el-tour v-model="open">
    <!-- START GAME -->
    <template v-if="isElementVisible('#btn1')">
      <el-tour-step
        target="#btn1"
        title="START GAME"
        description="Press this button to kick off the game and begin the fun!"
      />
    </template>

    <!-- CREDITS and CASHOUT -->
    <template v-if="isElementVisible('#btn2')">
      <el-tour-step
        target="#btn2"
        title="Credits and Cashout"
        description="View your available credits or balance for the game. Use the Cashout option to withdraw your in-game balance."
      />
    </template>

    <!-- PLAYER -->
    <template v-if="isElementVisible('#btn3')">
      <el-tour-step
        target="#btn3"
        title="PLAYER"
        description="This is where your cards are displayed for easy viewing and strategic gameplay."
      />
    </template>

    <!-- PLAYER CARD -->
    <template v-if="isElementVisible('#btn4')">
      <el-tour-step
        target="#btn4"
        title="PLAYER CARD"
        description="This is where your cards are prominently displayed with an enhanced user interface for better visibility and interaction."
      />
    </template>

    <!-- POT -->
    <template v-if="isElementVisible('#btn5')">
      <el-tour-step
        target="#btn5"
        title="POT"
        description="This shows the total pot amount that every player is required to contribute to before gameplay proceeds."
      />
    </template>

    <!-- TIMER -->
    <template v-if="isElementVisible('#btn6')">
      <el-tour-step
        target="#btn6"
        title="TIMER"
        description="This 20-second timer allows you to carefully plan your next strategic move. If you don't make a decision within the time limit, the game will automatically fold your hand."
      />
    </template>

    <!-- ALL IN -->
    <template v-if="isElementVisible('#btn7')">
      <el-tour-step
        target="#btn7"
        title="ALL IN"
        description="This function places an all-in bet equal to the total pot amount, committing all your available credits to the game. It's a high-risk, high-reward move that could turn the tides of the gameplay."
      />
    </template>

    <!-- BET -->
    <template v-if="isElementVisible('#btn8')">
      <el-tour-step
        target="#btn8"
        title="BET"
        description="This function allows you to place a bet, whether it's half the maximum amount or any specific amount of your choice, giving you flexibility in your gameplay strategy."
      />
    </template>

    <!-- FOLD -->
    <template v-if="isElementVisible('#btn9')">
      <el-tour-step
        target="#btn9"
        title="FOLD"
        description="This is where you can choose to fold your cards, exit the current round, and patiently wait for the next one to begin."
      />
    </template>

    <!-- CARD COUNT SHOE -->

    <template v-if="isElementVisible('#btn10')">
      <el-tour-step
        target="#btn10"
        title="CARD SHOE"
        description="This section provides real-time information on the total number of cards in the shoe and how many remain in play. It serves as a crucial reference for players, allowing them to track card depletion and strategize accordingly."
      />
    </template>
  </el-tour>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useGameStore } from '@/stores/game-store'
const gameStore = useGameStore()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  },
})

const isElementVisible = (selector: string): boolean => {
  return !!document.querySelector(selector)
}

const open = ref(false)

watch(
  () => props.isOpen,
  (newValue) => {
    open.value = newValue
    if (!newValue) {
      console.log('tetetetet')
      gameStore.resumeTurnTimer()
    }
  },
  { immediate: true },
)
</script>
