<template>
  <div class="p-6 bg-gray-50 rounded-lg shadow-md space-y-6">
    <h2 class="text-2xl font-bold">Tax Dashboard</h2>

    <!-- Tax Stats Summary -->
    <div class="grid grid-cols-2 gap-4">
      <div class="p-4 bg-white rounded shadow">
        <h3 class="font-semibold text-lg">Total Tax Collected</h3>
        <p class="text-2xl text-green-600">₱{{ totalTaxCollected }}</p>
      </div>
      <div class="p-4 bg-white rounded shadow">
        <h3 class="font-semibold text-lg">Tax Rate</h3>
        <p class="text-2xl text-blue-600">{{ taxRate * 100 }}%</p>
      </div>
    </div>

    <!-- Tax Stats Details -->
    <div class="p-4 bg-white rounded shadow space-y-2">
      <h3 class="font-semibold text-lg">Tax Stats</h3>
      <ul class="text-gray-700">
        <li>Total Events: {{ taxStats.numberOfTaxEvents }}</li>
        <li>Average Tax Amount: ₱{{ taxStats.averageTaxAmount.toFixed(2) }}</li>
        <li>Largest Tax Collected: ₱{{ taxStats.largestTaxAmount }}</li>
      </ul>
    </div>

    <!-- Recent Tax Events -->
    <div class="p-4 bg-white rounded shadow">
      <h3 class="font-semibold text-lg mb-2">Recent Tax Events</h3>
      <ul v-if="recentEvents.length > 0" class="divide-y divide-gray-200">
        <li v-for="event in recentEvents" :key="event.timestamp" class="py-2 flex justify-between">
          <span>{{ event.playerName }} (₱{{ event.amount }})</span>
          <span class="text-sm text-gray-500">
            Round {{ event.roundNumber }} • {{ formatTimestamp(event.timestamp) }}
          </span>
        </li>
      </ul>
      <p v-else class="text-gray-500 text-sm">No tax events yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTaxation } from '@/composables/tax/useTaxation'
import { onMounted, onUnmounted } from 'vue'

const { totalTaxCollected, taxRate, taxStats, recentEvents, updateTaxStoreFromLocalStorage } =
  useTaxation()

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

onMounted(() => {
  window.addEventListener('storage', updateTaxStoreFromLocalStorage)
  updateTaxStoreFromLocalStorage()
  console.log('Tax Dashboard mounted and local storage listener added.')
})

onUnmounted(() => {
  window.removeEventListener('storage', updateTaxStoreFromLocalStorage)
  console.log('Tax Dashboard unmounted and local storage listener removed.')
})
</script>

<style scoped></style>
