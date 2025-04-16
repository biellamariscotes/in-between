import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayerStore = defineStore('playerStore', () => {
  const playerCount = ref<number | null>(JSON.parse(localStorage.getItem('playerCount') || 'null'))

  const setPlayerCount = (count: number) => {
    playerCount.value = count
    localStorage.setItem('playerCount', JSON.stringify(count))
  }
  return { playerCount, setPlayerCount }
})
