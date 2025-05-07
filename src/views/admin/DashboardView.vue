<template>
  <section>
    <h1 class="uppercase">Tax Dashboard</h1>
    <!-- Total Tax Collected -->
    <el-row>
      <el-col :span="24" class="center">
        <div class="btn-group total-tax">
          <Button variant="secondary">₱{{ totalTaxCollected }}</Button>
          <h2 class="pt-1 pb-2">Total Tax Collected</h2>
        </div>
      </el-col>
    </el-row>

    <!-- Tax Stats -->
    <el-row justify="center">
      <!-- Average Tax Amount -->
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 24 }"
        :md="{ span: 5 }"
        :lg="{ span: 5 }"
        :xl="{ span: 5 }"
        class="border center flex-column pr-1"
      >
        <h1>₱{{ taxStats.averageTaxAmount.toFixed(2) }}</h1>
        <h4 class="mt-05">Average Tax Amount</h4>
      </el-col>

      <!-- Total Tax Events -->
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 24 }"
        :md="{ span: 5 }"
        :lg="{ span: 5 }"
        :xl="{ span: 5 }"
        class="border center flex-column pl-1"
      >
        <h1>{{ taxStats.numberOfTaxEvents }} events</h1>
        <h4 class="mt-05">Total Tax Events</h4>
      </el-col>

      <!-- Largest Tax Collected -->
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 24 }"
        :md="{ span: 5 }"
        :lg="{ span: 5 }"
        :xl="{ span: 5 }"
        class="border center flex-column pl-1"
      >
        <h1>₱{{ taxStats.largestTaxAmount }}</h1>
        <h4 class="mt-05">Average Tax Amount</h4>
      </el-col>
    </el-row>

    <!-- Tax Details Table -->
    <el-row>
      <el-col
        :xs="{ span: 24 }"
        :sm="{ span: 24 }"
        :md="{ span: 24 }"
        :lg="{ span: 24 }"
        :xl="{ span: 24 }"
        class="center flex-column pt-3"
      >
        <!-- Table Component -->
        <el-table
          v-if="recentEvents.length > 0"
          :data="paginatedData"
          border
          class="table-cont"
          row-class-name="no-hover"
        >
          <!-- Player Name -->
          <el-table-column label="Player" prop="playerName" :formatter="formatPlayerName" />

          <!-- Tax Amount Collected -->
          <el-table-column label="Amount" width="120">
            <template #default="{ row }"> ₱{{ row.amount }} </template>
          </el-table-column>

          <!-- Timestamp -->
          <el-table-column label="Timestamp" width="200">
            <template #default="{ row }">
              {{ formatTimestamp(row.timestamp) }}
            </template>
          </el-table-column>
        </el-table>

        <!-- Pagination Component - simple version -->
        <el-pagination
          v-if="recentEvents.length > 0"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="recentEvents.length"
          background
          class="mt-4"
        />

        <!-- Empty State -->
        <p v-else class="text-gray-500 text-sm">No tax events yet.</p>
      </el-col>
    </el-row>

    <!-- Recent Tax Events -->
    <!-- <div class="p-4 bg-white rounded shadow">
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
    </div> -->
  </section>
</template>

<script setup lang="ts">
import { useTaxation } from '@/composables/tax/useTaxation'
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useFormat } from '@/composables/utilities/useFormat'

const { toSentenceCase } = useFormat()

const { totalTaxCollected, taxStats, recentEvents, updateTaxStoreFromLocalStorage } = useTaxation()

type PlayerRow = {
  playerName: string
}

// ─────────────────────────────
// Formatting
// ─────────────────────────────

const formatPlayerName = (row: PlayerRow) => toSentenceCase(row.playerName)

const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

// ─────────────────────────────
// Lifecycle Hooks
// ─────────────────────────────

const currentPage = ref(1)
const pageSize = ref(5) // Show 5 items per page

// Calculate paginated data
const paginatedData = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return recentEvents.value.slice(startIndex, endIndex)
})

// Event handlers
const handleCurrentChange = (val: number) => {
  currentPage.value = val
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

<style scoped>
* {
  color: #fff;
}

:deep(.el-pagination) {
  --el-pagination-button-color: #606266;
  --el-pagination-hover-color: #409eff;
}

:deep(.el-pagination .el-pager li) {
  cursor: pointer;
}

:deep(.el-pagination .btn-prev),
:deep(.el-pagination .btn-next) {
  cursor: pointer;
}
</style>
