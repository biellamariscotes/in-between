<template>
  <div class="modal">
    <!-- Title of the player selection -->
    <img src="../../assets/img/landing-assets/choose-player-title.png" class="registration-title" />

    <!-- Grid of player number options -->
    <div class="number-grid">
      <div
        v-for="num in [3, 4, 5, 6]"
        :key="num"
        class="number-button"
        :class="{ selected: playerStore.playerCount === num }"
        @click="selectPlayer(num)"
      >
        <img :src="getImagePath(num)" />
      </div>
    </div>

    <!-- Submit Buttons -->
    <Button
      btnType="submit"
      variant="secondary"
      style="margin-top: 2rem"
      @click="onSubmit"
      :disabled="!playerStore.playerCount"
    >
      Submit
    </Button>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/player-count'
import { useRouter } from 'vue-router'

const playerStore = usePlayerStore()
const router = useRouter()

// Map player numbers to their respective image paths

import img3 from '@/assets/img/landing-assets/3.png'
import img4 from '@/assets/img/landing-assets/4.png'
import img5 from '@/assets/img/landing-assets/5.png'
import img6 from '@/assets/img/landing-assets/6.png'

type PlayerNumber = 3 | 4 | 5 | 6

// Map player count numbers to their respective image paths
const imageMap: Record<PlayerNumber, string> = {
  3: img3,
  4: img4,
  5: img5,
  6: img6,
}

/**
 * Updates the player count in the store when a number is selected
 */

function selectPlayer(num: number) {
  playerStore.setPlayerCount(num)
  console.log('you select ', playerStore.playerCount)
}

/**
 * Gets the appropriate image path for a player number
 */

function getImagePath(num: number): string {
  return imageMap[num as PlayerNumber]
}

/**
 * Handles the submission of player count selection
 * Navigates to the registration page if a valid count is selected
 */
const onSubmit = () => {
  if (playerStore.playerCount) {
    console.log(localStorage.getItem('playerCount'))
    router.push('/registration')
  } else {
    console.error('No Player Selected')
  }
}
</script>
