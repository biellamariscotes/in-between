<!-- Back Card Component
  Displays the static image of a card back.

  Features:
    - Renders an ElImage component with the back card image.
-->

<template>
  <!-- Card back image -->
  <el-image :src="BackCard" fit="contain" class="back-card" />
</template>

<script setup lang="ts">
import BackCard from '@/assets/img/cards/special-cards/back-card.png'
</script>
