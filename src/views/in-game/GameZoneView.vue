<template>
  <div class="game-zone-container">
    <el-image
      :src="GameTable"
      style="height: 85%; width: 85%; position: absolute; pointer-events: none; user-select: none"
      alt="Game Table"
      :draggable="false"
    />
    <div class="turn-container">
      <h1 style="color: white">{{ currentPlayer }}'s Turn</h1>
    </div>
    <div class="game-zone">
      <div
        style="
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
        <h1>Left cards</h1>
      </div>
    </div>
    <div class="table-container">
      <div
        v-for="position in 6"
        :key="position"
        :class="[
          `player-${position}`,
          {
            'active-player': activePlayers[position - 1] && currentPlayerIndex === position - 1,
            'inactive-spot': !activePlayers[position - 1],
          },
        ]"
      >
        <div
          :class="[
            'player-indicator-container',
            { 'player-info-left': position === 6 },
            { 'player-info-right': position === 5 },
            { 'player-info-reverse': position === 3 || position === 4 },
          ]"
        >
          <div
            v-if="activePlayers[position - 1] && currentPlayerIndex === position - 1"
            class="turn-indicator"
          >
            <div
              :class="[
                'arrow-animation',
                { 'arrow-bottom': position === 3 || position === 4 },
                { 'arrow-left': position === 6 },
                { 'arrow-right': position === 5 },
              ]"
            ></div>
          </div>
          <div
            :class="[
              'player-info',
              { 'info-left': position === 6 },
              { 'info-right': position === 5 },
            ]"
          >
            <h1 class="player-name">
              {{ activePlayers[position - 1] ? `Player ${position}` : 'Empty' }}
            </h1>
            <h1 class="player-points">P 500</h1>
          </div>
          <PlayerHand
            :cards="playerCards[position - 1]"
            :show-cards="currentPlayerIndex === position - 1"
            :orientation="position === 5 ? 'left' : position === 6 ? 'right' : 'normal'"
          />
        </div>
      </div>
      <div class="pot-amount">
        <h1 class="border">POT AMOUNT</h1>
      </div>
    </div>
    <div class="actions-container">
      <h1 style="color: white">Action Container</h1>
    </div>
    <div class="timer-container">
      <h1 style="color: white">Timer</h1>
    </div>
    <div class="settings-container">
      <h1 style="color: white">Gear Icon</h1>
    </div>
    <div></div>
  </div>

  <!-- TEST BLOCK: REMOVE IF NOT NEEDED -->

  <div>
    <h2 v-if="orderedPlayers.length">Player Order</h2>
    <ul>
      <li v-for="player in orderedPlayers" :key="player.id">
        {{ player.randomizedPosition }}. {{ player.name }}
      </li>
    </ul>

    <button @click="handleRandomize">Randomize Players</button>
    <button @click="resetPlayerOrder">Reset Order</button>

    <div v-if="currentTurnPlayer">
      <p>Current Turn: {{ turn }}</p>
      <p>Current Player: {{ currentTurnPlayer.name }}</p>
      <button @click="goToNextTurn">Next Turn</button>
    </div>

    <pre>{{ JSON.stringify(orderedPlayers, null, 2) }}</pre>
  </div>

  <!-- END OF TEST BLOCK -->
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import GameTable from '@/assets/img/game-zone/Game-Table.svg'
import { usePlayerRandomizer } from '@/composables/usePlayerRandomizer'

// TEST BLOCK SCRIPT: REMOVE IF NOT NEEDED
const { orderedPlayers, randomizePlayers, getCurrentPlayer, resetPlayerOrder } =
  usePlayerRandomizer()

const turn = ref(1)

const currentTurnPlayer = computed(() => getCurrentPlayer(turn.value))

const handleRandomize = () => {
  randomizePlayers()
}

const goToNextTurn = () => {
  turn.value++
}

// END OF TEST BLOCK SCRIPT: REMOVE IF NOT NEEDED

// Sample player cards
const playerCards = ref([
  ['h10', 'sking', 'dqueen'], // Player 1
  ['c7', 'd8', 'h2'], // Player 2
  ['sjack', 'c3', 'd1'], // Player 3
  ['h5', 'd6', 's9'], // Player 4
  ['h8', 'c9', 'hking'], // Player 5
  ['d3', 's5', 'c2'], // Player 6
])

// Player configuration
const playerCount = ref(6) // Change this to set the number of players (1-6)

// Determine which player positions are active based on playerCount
const activePlayers = computed(() => {
  const active = Array(6).fill(false)
  // Distribution logic for different player counts
  if (playerCount.value === 1) {
    active[0] = true // Only Player 1
  } else if (playerCount.value === 2) {
    active[0] = true // Player 1
    active[1] = true // Player 2
  } else if (playerCount.value === 3) {
    active[0] = true // Player 1
    active[1] = true // Player 2
    active[2] = true // Player 3
  } else if (playerCount.value === 4) {
    active[0] = true // Player 1
    active[1] = true // Player 2
    active[2] = true // Player 3
    active[3] = true // Player 4
  } else if (playerCount.value === 5) {
    active[0] = true // Player 1
    active[1] = true // Player 2
    active[2] = true // Player 3
    active[3] = true // Player 4
    active[4] = true // Player 5
  } else if (playerCount.value === 6) {
    active.fill(true) // All 6 players active
  }
  return active
})

// Active player list
const activePlayersList = computed(() => {
  return activePlayers.value
    .map((isActive, index) => {
      return isActive ? `Player ${index + 1}` : null
    })
    .filter(Boolean)
})

// Current player tracking
const currentPlayerIndex = ref(0)
const currentPlayer = computed(() => {
  // Find the name of the active player at the current index
  let count = 0
  for (let i = 0; i < activePlayers.value.length; i++) {
    if (activePlayers.value[i]) {
      if (count === currentPlayerIndex.value) {
        return `Player ${i + 1}`
      }
      count++
    }
  }
  return 'No Players'
})

// Reset current player index if player count changes
watch(playerCount, () => {
  currentPlayerIndex.value = 0
})

// For demo purposes - this cycles through active players automatically
onMounted(() => {
  setInterval(() => {
    if (activePlayersList.value.length > 0) {
      currentPlayerIndex.value = (currentPlayerIndex.value + 1) % activePlayersList.value.length
    }
  }, 3000) // Change player every 3 seconds
})
</script>
