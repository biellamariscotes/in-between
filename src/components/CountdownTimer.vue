<template>
  <div class="circle">
    <div class="image-container">
      <img class="time-img" :src="getSvgSrc(timeRemaining)" alt="Timer Digit" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const numberSvgs: Record<number, string> = {
  0: '/src/assets/img/timer/0.svg',
  1: '/src/assets/img/timer/1.1.svg',
  2: '/src/assets/img/timer/2.svg',
  3: '/src/assets/img/timer/3.svg',
  4: '/src/assets/img/timer/4.svg',
  5: '/src/assets/img/timer/5.svg',
  6: '/src/assets/img/timer/6.svg',
  7: '/src/assets/img/timer/7.svg',
  8: '/src/assets/img/timer/8.svg',
  9: '/src/assets/img/timer/9.9.svg',
  10: '/src/assets/img/timer/10.svg',
}

const timeRemaining = ref(10)

const getSvgSrc = (number: number): string =>
  numberSvgs[number] || '/src/assets/img/timer/default.svg'

onMounted(() => {
  const interval = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
    } else {
      clearInterval(interval)
    }
  }, 1000)
})
</script>

<style lang="css" scoped>
.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: rgb(8, 8, 8);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.3);
}

.time-img {
  width: 75%;
  height: 75%;
  object-fit: contain;
  object-position: center;
}

.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
