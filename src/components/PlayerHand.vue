<template>
  <div 
    class="player-hand" 
    :class="[
      orientation === 'left' ? 'hand-left' : 
      orientation === 'right' ? 'hand-right' : 
      'hand-normal'
    ]"
  >
    <div class="card-wrapper" v-for="(cardId, index) in cards" :key="index">
      <PlayingCard 
        :card-id="cardId" 
        :face-up="showCards" 
        class="player-card"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import PlayingCard from './PlayingCard.vue';

defineProps({
  cards: {
    type: Array as () => string[],
    default: () => []
  },
  showCards: {
    type: Boolean,
    default: false
  },
  orientation: {
    type: String,
    default: 'normal', // 'normal', 'left', or 'right'
    validator: (value: string) => ['normal', 'left', 'right'].includes(value)
  }
});
</script>

<style scoped>
.player-hand {
  display: flex;
  justify-content: center;
  gap: 5px;
  width: 100%;
  position: relative;
  transition: transform 0.2s ease;
}

.card-wrapper {
  width: 50px;
  height: 70px;
  flex-shrink: 0;
  margin: 0 2px;
  transition: transform 0.2s ease;
}

/* Rotate the entire hand container instead of individual cards */
.hand-left {
  transform: rotate(90deg);
}

.hand-right {
  transform: rotate(-90deg);
}

.hand-left, .hand-right {
  position: relative;
  height: auto;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.player-card {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.2s ease;
}

.player-card:hover {
  transform: translateY(-5px);
  z-index: 5;
}

/* Adjust hover effect for rotated hands */
.hand-left .player-card:hover {
  transform: translateX(-5px);
}

.hand-right .player-card:hover {
  transform: translateX(5px);
}
</style>
