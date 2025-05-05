<template>
  <div class="modal choose-player-modal">
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
      class="next-btn"
      @click="onSubmit"
      :disabled="!playerStore.playerCount"
    >
      Start Game
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

<style lang="scss" scoped>
.choose-player-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.number-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 1rem 0 2rem;
}
.registration-title {
  width: 70%;
  max-width: 500px;
  margin-bottom: 1rem;
}

.number-button {
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  
  img {
    width: 100%;
    transition: transform 0.3s ease;
  }
  
  &.selected img {
    transform: scale(1.1);
  }
  
  &:hover img {
    transform: scale(1.05);
  }
}

.next-btn {
  margin-top: 1rem;
}

/* Responsive styles for mobile landscape orientation */
@media screen and (max-height: 500px) and (orientation: landscape) {
  .choose-player-modal {
    padding: 0.5rem;
  }
  
  .number-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin: 0.5rem 0 1rem;
    max-width: 90%;
  }
  
  .number-button {
    padding: 0.25rem;
    
    img {
      max-width: 100%;
    }
  }
  
  .next-btn {
    margin-top: 0.5rem;
    padding: 0.5rem 1.5rem;
  }
}

/* Extra small devices */
@media screen and (max-height: 400px) and (orientation: landscape) {
  .choose-player-modal {
    padding: 0.3rem;
  }
  
  .number-grid {
    gap: 0.5rem;
  }
}
</style>
