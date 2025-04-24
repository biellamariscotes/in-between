<template>
  <div class="card-container">
    <div class="playing-card" :class="{ 'is-flipped': faceUp }">
      <div class="card-face card-back">
        <el-image :src="BackCard" class="card-image" :draggable="false" :class="customClass" />
      </div>
      <div class="card-face card-front">
        <el-image
          v-if="cardData"
          :src="getCardImagePath(cardData.id)"
          class="card-image"
          :draggable="false"
          :class="customClass"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import BackCard from '@/assets/img/cards/special-cards/back-card.png'
import { useDataFetcher } from '@/composables/useDataFetcher'
import type { Card } from '@/interface/card'

const props = defineProps({
  cardId: {
    type: String,
    default: '',
  },
  faceUp: {
    type: Boolean,
    default: false,
  },
  customClass: {
    type: String,
    default: '',
  },
})

const { data: cardsData } = useDataFetcher<Card[]>('/src/data/cards.json')

const cardData = computed<Card | undefined>(() => {
  if (!props.cardId || !cardsData.value) return undefined
  return cardsData.value.find((card) => card.id === props.cardId)
})

// Debug logging
watchEffect(() => {
  if (cardData.value) {
    const imagePath = getCardImagePath(cardData.value.id)
    console.log('🖼️ Image Path:', imagePath)
  }
})

function getCardImagePath(id: string | undefined): string {
  if (!id) return ''
  return new URL(`../../assets/img/cards/${id}.svg`, import.meta.url).href
}
</script>

<style scoped>
.card-container {
  width: 100%; /* or fixed width like 200px */
  aspect-ratio: 2.5 / 3.5; /* optional for consistent sizing */
}

.playing-card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.playing-card.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  inset: 0; /* shorthand for top/right/bottom/left: 0 */
  backface-visibility: hidden;
  border-radius: 4px;
  box-shadow: 0.5px 0.5px 3px rgba(0, 0, 0, 0.5);
}

.card-front {
  transform: rotateY(180deg);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* ensures it fills properly */
  border-radius: 4px;
}

.card-container:hover .playing-card {
  transform: translateY(-4px) rotateY(0deg);
}

.card-container:hover .playing-card.is-flipped {
  transform: translateY(-4px) rotateY(180deg);
}
</style>
