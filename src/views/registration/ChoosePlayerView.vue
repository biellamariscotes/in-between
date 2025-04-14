<template>
  <div class="overlaychooseplayer">
    <div class="modal">
      <h2 class="title">CHOOSE NUMBER<br />OF PLAYERS</h2>
      <div class="number-grid">
        <div
          v-for="num in [3, 4, 5, 6, 7, 8]"
          :key="num"
          class="number-button"
          :class="{ selected: selectedPlayer === num }"
          @click="selectPlayer(num)"
        >
          <img :src="getImagePath(num)" />
        </div>
      </div>
      <button class="confirm-btn" :disabled="!selectedPlayer">CONFIRM</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import img3 from '@/assets/img/landing-assets/3.png'
import img4 from '@/assets/img/landing-assets/4.png'
import img5 from '@/assets/img/landing-assets/5.png'
import img6 from '@/assets/img/landing-assets/6.png'
import img7 from '@/assets/img/landing-assets/7.png'
import img8 from '@/assets/img/landing-assets/8.png'

type PlayerNumber = 3 | 4 | 5 | 6 | 7 | 8
const imageMap: Record<PlayerNumber, string> = {
  3: img3,
  4: img4,
  5: img5,
  6: img6,
  7: img7,
  8: img8,
}

const selectedPlayer = ref<number | null>(null)
function selectPlayer(num: number) {
  selectedPlayer.value = num
}

function getImagePath(num: number): string {
  return imageMap[num as PlayerNumber]
}
</script>

<style scoped>
button {
  font-family: 'Grand-Casino' !important;
  font-size: 28px;
  color: white;
  margin-bottom: 30px;
  text-shadow: 0 0 4px #000;
}
</style>
