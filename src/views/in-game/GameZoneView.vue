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
        <div :class="[
            'player-indicator-container',
            { 'player-info-left': position === 6 },
            { 'player-info-right': position === 5 },
            { 'player-info-reverse': position === 3 || position === 4 }
          ]">
          <div
            v-if="activePlayers[position - 1] && currentPlayerIndex === position - 1"
            class="turn-indicator"
          >
            <div :class="[
              'arrow-animation', 
              { 'arrow-bottom': position === 3 || position === 4 },
              { 'arrow-left': position === 6 },
              { 'arrow-right': position === 5 }
            ]"></div>
          </div>
          <div :class="[
              'player-info',
              { 'info-left': position === 6 },
              { 'info-right': position === 5 }
            ]">
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
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import GameTable from '@/assets/img/game-zone/Game-Table.svg'
import PlayerHand from '@/components/PlayerHand.vue'

// Sample player cards
const playerCards = ref([
  ['h10', 'sking', 'dqueen'], // Player 1
  ['c7', 'd8', 'h2'],        // Player 2
  ['sjack', 'c3', 'd1'],     // Player 3
  ['h5', 'd6', 's9'],        // Player 4
  ['h8', 'c9', 'hking'],     // Player 5
  ['d3', 's5', 'c2']         // Player 6
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

<style lang="css" scoped>
.game-zone-container {
  width: 100%;
  height: 100vh;
  background-image: url('@/assets/img/game-zone/play-background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}
.settings-container {
  width: 5%;
  height: 8%;
  position: absolute;
  bottom: 7%;
  right: 7%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  border: 2px solid white;
  pointer-events: none;
}
.timer-container {
  width: 13%;
  height: 13%;
  position: absolute;
  top: 7%;
  right: 7%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  border: 2px solid white;
  pointer-events: none;
}
.actions-container {
  width: 40%;
  height: 18%;
  position: absolute;
  bottom: 7%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  border: 2px solid white;
  pointer-events: none;
}
.game-zone {
  width: 10%;
  height: 80%;
  position: absolute;
  left: 7%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  border: 2px solid white;
  pointer-events: none;
}
.turn-container {
  width: 40%;
  height: 10%;
  position: absolute;
  top: 3%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  border: 2px solid white;
  pointer-events: none;
}
.table-container {
  width: 45%;
  height: 42%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  pointer-events: none;
  top: 26%;
  left: 50%;
  transform: translateX(-50%);
}
.player-1 {
  position: absolute;
  bottom: 0;
  left: 25%;
  width: 20%;
}
.player-2 {
  position: absolute;
  bottom: 0;
  right: 25%;
  width: 20%;
}
.player-3 {
  position: absolute;
  top: 0;
  left: 25%;
  width: 20%;
}
.player-4 {
  position: absolute;
  top: 0;
  right: 25%;
  width: 20%;
}
.player-5 {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 15%;
  height: 35%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.player-6 {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 15%;
  height: 35%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pot-amount {
  position: absolute;
  width: 20%;
  height: 30%;
}
.border {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid white;
  margin: 0;
  position: relative;
}
.active-player {
  background-color: rgba(255, 215, 0, 0.3);
  transition: background-color 0.3s ease;
}
.inactive-spot {
  background-color: rgba(30, 30, 30, 0.5);
  opacity: 0.6;
}
.player-indicator-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.player-info-reverse {
  flex-direction: column-reverse;
}

.player-info-left {
  flex-direction: row;
  width: 100%;
  height: 100%;
  justify-content: space-around;
  align-items: center;
}

.player-info-right {
  flex-direction: row-reverse;
  width: 100%;
  height: 100%;
  justify-content: space-around;
  align-items: center;
}

/* Update styles for player 5 and 6 cards display */
.player-5 .player-hand, .player-6 .player-hand {
  width: 55%; /* Reduced to better fit when rotated */
  height: 100%;
  margin: 0;
  align-items: center;
}

/* Container adjustments for side players */
.player-5 .player-indicator-container, 
.player-6 .player-indicator-container {
  justify-content: center;
}

/* Remove conflicting transform styles from GameZoneView that would override PlayerHand component rotations */
.player-5 .card-wrapper,
.player-6 .card-wrapper {
  margin: 0 5px;
  transform: none;
}

.player-5 .player-card:hover, 
.player-6 .player-card:hover {
  transform: none; /* Let the PlayerHand component handle hover effects */
}

/* Add styling for the center card */
.center-card {
  transform: scale(1.5);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
}

/* Remove old card container styles that are now handled by PlayerHand */
.cards-container, .cards-left, .cards-right, .back-card {
  display: none;
}

@keyframes pulse {
  0% {
    opacity: 0.7;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes bounce-reverse {
  0%,
  100% {
    transform: translateY(0) rotate(180deg);
  }
  50% {
    transform: translateY(10px) rotate(180deg);
  }
}

@keyframes bounce-left {
  0%,
  100% {
    transform: translateX(0) rotate(270deg);
  }
  50% {
    transform: translateX(10px) rotate(270deg);
  }
}

@keyframes bounce-right {
  0%,
  100% {
    transform: translateX(0) rotate(90deg);
  }
  50% {
    transform: translateX(-10px) rotate(90deg);
  }
}

/* Update the horizontal player containers to properly show cards */
.player-5 .player-hand, .player-6 .player-hand {
  width: 100%;
  height: 100%;
  margin-top: 0;
  justify-content: center;
  align-items: center;
}

/* Adjust spacing for rotated cards in players 5 and 6 */
.player-5 .card-wrapper, .player-6 .card-wrapper {
  margin: 0 5px;
}

/* Remove conflicting transformations that might interfere with rotation */
.player-5 .player-card:hover, .player-6 .player-card:hover {
  transform: translateY(-3px) rotate(0);
}

/* Remove duplicate styles that conflict */
.arrow-animation {
  position: absolute;
  top: -20px;
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 20px solid gold;
  animation: 
    pulse 1s infinite alternate,
    bounce 1.5s infinite;
  filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.7));
  /* Reset any transform to avoid conflicts */
  transform: none;
}

/* Player text styling */
.player-name, .player-points {
  color: white;
  font-size: 12px;
  margin: 2px 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

.player-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
}

/* Make pot text smaller and white */
.pot-amount h1 {
  color: white;
  font-size: 14px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}
</style>
