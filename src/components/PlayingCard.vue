<template>
  <div class="card-container">
    <div class="playing-card" :class="{ 'is-flipped': faceUp }">
      <div class="card-face card-back">
        <el-image
          :src="BackCard"
          class="card-image" 
          :draggable="false"
          :class="customClass"
        />
      </div>
      <div class="card-face card-front">
        <el-image
          v-if="cardData"
          :src="getCardImagePath(cardData.file_name)"
          class="card-image"
          :draggable="false"
          :class="customClass"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BackCard from '@/assets/img/back-card.png';
import { useDataFetcher } from '@/composables/useDataFetcher';
import type {Card} from '@/interface/card'; 
const props = defineProps({
  cardId: {
    type: String,
    default: ''
  },
  faceUp: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: ''
  }
});

const { data: cardsData } = useDataFetcher<Card[]>('/src/data/cards.json');

const cardData = computed<Card | undefined>(() => {
  if (!props.cardId || !cardsData.value) return undefined;
  return cardsData.value.find(card => card.id === props.cardId);
});

function getCardImagePath(fileName: string | undefined): string {
  if (!fileName) {
    return ''; // Return empty string or a default image path if fileName is undefined
  }
  return new URL(`../assets/img/cards/${fileName}`, import.meta.url).href;
}
</script>

<style scoped>
.card-container {
  width: 20%;  
  height: 90%; 
  perspective: 1000px;
  margin: 0 -3px;
}

.playing-card {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  cursor: pointer;
}

.playing-card.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
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
  border-radius: 4px; 
}

.card-container:hover .playing-card:not(.is-flipping) {
  transform: translateY(-4px) rotateY(0); 
}

.card-container:hover .playing-card.is-flipped:not(.is-flipping) {
  transform: translateY(-4px) rotateY(180deg);
}
</style>
