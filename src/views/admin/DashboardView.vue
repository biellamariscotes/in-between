<template>
  <div class="tax-dashboard">
    <h1 class="text-2xl font-bold mb-6">Tax Dashboard</h1>

    <div class="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="stat-card bg-gray-50 p-4 rounded-lg shadow-sm">
        <h3 class="text-lg font-medium text-gray-700">Total Tax Collected</h3>
        <p class="text-3xl font-bold">{{ formatCurrency(taxStats.totalCollected) }}</p>
      </div>

      <div class="stat-card bg-gray-50 p-4 rounded-lg shadow-sm">
        <h3 class="text-lg font-medium text-gray-700">Tax Rate</h3>
        <p class="text-3xl font-bold">{{ taxRate }}%</p>
      </div>

      <div class="stat-card bg-gray-50 p-4 rounded-lg shadow-sm">
        <h3 class="text-lg font-medium text-gray-700">Tax Events</h3>
        <p class="text-3xl font-bold">{{ taxStats.numberOfTaxEvents }}</p>
      </div>

      <div class="stat-card bg-gray-50 p-4 rounded-lg shadow-sm">
        <h3 class="text-lg font-medium text-gray-700">Avg. Tax Amount</h3>
        <p class="text-3xl font-bold">{{ formatCurrency(taxStats.averageTaxAmount) }}</p>
      </div>
    </div>

    <div class="flex flex-col md:flex-row gap-6">
      <!-- Recent Tax Events -->
      <div class="flex-1">
        <h2 class="text-xl font-semibold mb-4">Recent Tax Events</h2>
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Player
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Round
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Time
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="event in recentEvents" :key="`${event.playerId}-${event.timestamp}`">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ event.playerName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatCurrency(event.amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ event.roundNumber }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatTime(event.timestamp) }}
                </td>
              </tr>
              <tr v-if="recentEvents.length === 0">
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                  colspan="4"
                >
                  No tax events yet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tax by Player -->
      <div class="flex-1">
        <h2 class="text-xl font-semibold mb-4">Tax Collected by Player</h2>
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Player
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Tax
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(player, index) in playerTaxList" :key="index">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ player.name || 'Unknown' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatCurrency(player.amount) }}
                </td>
              </tr>
              <tr v-if="playerTaxList.length === 0">
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                  colspan="2"
                >
                  No tax data available
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-end">
      <button
        @click="resetTaxData"
        class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Reset Tax Data
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useTaxation } from '@/composables/tax/useTaxation'
import { usePlayerRegistration } from '@/stores/player'

// Get taxation composable
const {
  getTaxStats,
  getRecentTaxEvents,
  getTaxByPlayer,
  resetTaxData: resetTax,
  taxRate,
} = useTaxation()

// Get player store to retrieve player names
const playerStore = usePlayerRegistration()

// Reactive data
const taxStats = ref(getTaxStats())
const recentEvents = ref(getRecentTaxEvents(10))

// Watch for changes in tax stats and recent events
watch(
  () => getTaxStats(),
  (newStats) => {
    taxStats.value = newStats
  },
)

watch(
  () => getRecentTaxEvents(10),
  (newEvents) => {
    recentEvents.value = newEvents
  },
)

// Format player tax data with names
const playerTaxList = computed(() => {
  const taxByPlayer = getTaxByPlayer()
  const result = []

  for (const [playerId, amount] of Object.entries(taxByPlayer)) {
    const player = playerStore.players.find((p) => p.id === playerId)
    result.push({
      id: playerId,
      name: player?.name || 'Unknown Player',
      amount,
    })
  }

  // Sort by amount (highest first)
  return result.sort((a, b) => b.amount - a.amount)
})

// Format currency values
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Format timestamp to readable time
const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString()
}

// Reset tax data
const resetTaxData = () => {
  if (confirm('Are you sure you want to reset all tax data? This cannot be undone.')) {
    resetTax()
  }
}

// Load player data on mount
onMounted(() => {
  playerStore.loadPlayersFromStorage()
  // Periodically refresh data
  setInterval(() => {
    taxStats.value = getTaxStats()
    recentEvents.value = getRecentTaxEvents(10)
  }, 60000) // Refresh every 60 seconds
})
</script>

<style scoped>
.tax-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
