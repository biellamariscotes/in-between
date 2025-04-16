<template>
  <div class="modal">
    <h2 class="title">CHOOSE NUMBER<br />OF PLAYERS</h2>
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
    <Button
      btnType="submit"
      variant="secondary"
      class="next-btn"
      @click="onSubmit"
      :disabled="!playerStore.playerCount"
    >
      Start Game
    </Button>

    <!-- <button class="confirm-btn" :disabled="!playerStore.playerCount">CONFIRM</button> -->
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/player-count'
import { useRouter } from 'vue-router'

import img3 from '@/assets/img/landing-assets/3.png'
import img4 from '@/assets/img/landing-assets/4.png'
import img5 from '@/assets/img/landing-assets/5.png'
import img6 from '@/assets/img/landing-assets/6.png'

const playerStore = usePlayerStore()
// playerStore.playerCount = null
// localStorage.removeItem('playerCount')

const router = useRouter()

type PlayerNumber = 3 | 4 | 5 | 6
const imageMap: Record<PlayerNumber, string> = {
  3: img3,
  4: img4,
  5: img5,
  6: img6,
}

function selectPlayer(num: number) {
  playerStore.setPlayerCount(num)
  console.log('you select ', playerStore.playerCount)
}

function getImagePath(num: number): string {
  return imageMap[num as PlayerNumber]
}

const onSubmit = () => {
  if (playerStore.playerCount) {
    console.log(localStorage.getItem('playerCount'))
    router.push('/registration')
  } else {
    console.error('No Player Selected')
  }
}
</script>
