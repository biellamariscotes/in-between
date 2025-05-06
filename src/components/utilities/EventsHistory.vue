<!-- Game History Component
  Displays the game history with automatic scrolling to the latest event.

  Props:
    - None

  Uses:
    - useGameHistory composable to fetch game events.
    - useFormat composable to format event messages.
-->

<template>
  <div class="history-title">
    <img src="../../assets/img/game-zone/history/history.png" />
  </div>
  <div id="btn11" class="player-history-container">
    <div ref="scrollContainer" class="scroll-container">
      <ul>
        <li v-for="(event, index) in gameHistory.allEvents.value" :key="index">
          {{ toSentenceCase(event.message) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated, watch, nextTick } from 'vue'
import { useGameHistory } from '@/composables/game/useGameHistory'
import { useFormat } from '@/composables/utilities/useFormat'

const { toSentenceCase } = useFormat()
const gameHistory = useGameHistory()
const scrollContainer = ref<HTMLElement | null>(null)

// ─────────────────────────────
// Private Helpers
// ─────────────────────────────
/**
 * Scrolls the container to the bottom.
 * Uses both scrollTop and scrollIntoView for reliability.
 */
const scrollToBottom = () => {
  console.log('Attempting to scroll to bottom')
  if (scrollContainer.value) {
    // Method 1: Using scrollTop
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
    console.log('Set scrollTop to:', scrollContainer.value.scrollHeight)

    // Method 2: Find the last element and scroll it into view
    const items = scrollContainer.value.querySelectorAll('li')
    if (items.length > 0) {
      const lastItem = items[items.length - 1]
      lastItem.scrollIntoView({ behavior: 'auto', block: 'end' })
      console.log('Scrolled last item into view')
    }
  } else {
    console.error('Scroll container ref is null')
  }
}

// ─────────────────────────────
// Watchers
// ─────────────────────────────

/**
 * Watches for changes in the length of game events.
 * Ensures the container scrolls to the bottom when new events are added.
 */
watch(
  () => gameHistory.allEvents.value.length,
  (newLength) => {
    console.log('Events length changed to:', newLength)

    // Use multiple timing approaches for maximum reliability
    nextTick(() => {
      scrollToBottom()

      // Additional delayed scroll for reliability
      setTimeout(scrollToBottom, 50)
    })
  },
)

// ─────────────────────────────
// Lifecycle Hooks
// ─────────────────────────────

/**
 * Initial scroll on mount with extra reliability.
 */
onMounted(() => {
  console.log('Component mounted')

  // Multiple timing approaches for initial load
  nextTick(() => {
    scrollToBottom()

    // Additional fallback scrolls with increasing delays
    setTimeout(scrollToBottom, 50)
    setTimeout(scrollToBottom, 200)
  })
})

/**
 * Ensure scroll after any DOM updates.
 */
onUpdated(() => {
  console.log('Component updated')
  scrollToBottom()

  // Backup scroll for reliability
  setTimeout(scrollToBottom, 20)
})
</script>

<style scoped>
.scroll-container {
  overflow-y: auto;
  max-height: 400px; /* Adjust as needed */
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 3px;
}
</style>
