<template>
  <div class="game-zone-container">
    <el-image
      :src="GameBackground"
      style="height: 100%; width: 100%; pointer-events: none; user-select: none"
      :draggable="false"
      alt="Game Background"
    />
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
      ></div>
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
        <div class="player-indicator-container">
          <div
            v-if="activePlayers[position - 1] && currentPlayerIndex === position - 1"
            class="turn-indicator"
          >
            <div class="arrow-animation"></div>
          </div>
          <h1 style="font-size: 20px">
            {{ activePlayers[position - 1] ? `Player ${position}` : 'Empty' }}
          </h1>
          <h1 style="font-size: 20px">P 500</h1>
          <div
            :class="[
              'cards-container',
              {
                'cards-left': position === 5,
                'cards-right': position === 6,
              },
            ]"
          >
            <el-image v-for="cardIndex in 3" :key="cardIndex" :src="BackCard" style="" />
          </div>
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
import GameBackground from '@/assets/img/game-zone/play-background.png'
import GameTable from '@/assets/img/game-zone/Game-Table.svg'
import BackCard from '@/assets/img/back-card.png'

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
    // Only increment if we have players
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
  display: grid;
  top: 26%;
  grid-template-columns: 1fr 1.1fr 0.8fr 1.1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    '. player3 . player4 .'
    'player5 . pot . player6'
    '. player1 . player2 .';
}

.player-1 {
  grid-area: player1;
  background-color: rgba(255, 255, 255, 0.5);
}
.player-2 {
  grid-area: player2;
  background-color: rgba(255, 255, 255, 0.5);
}
.player-3 {
  grid-area: player3;
  background-color: rgba(255, 255, 255, 0.5);
}
.player-4 {
  grid-area: player4;
  background-color: rgba(255, 255, 255, 0.5);
}
.player-5 {
  grid-area: player5;
  background-color: rgba(255, 255, 255, 0.5);
}
.player-6 {
  grid-area: player6;
  background-color: rgba(255, 255, 255, 0.5);
}
.pot-amount {
  grid-area: pot;
  background-color: rgba(255, 255, 255, 0.5);
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

/* Turn indicator styling */
.active-player {
  background-color: rgba(255, 220, 100, 0.6);
  transition: background-color 0.3s ease;
}

.inactive-spot {
  background-color: rgba(100, 100, 100, 0.3);
  opacity: 0.5;
}

.player-indicator-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.turn-indicator {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  pointer-events: none;
}

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
}

/* Card styling */
.cards-container {
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
  margin-top: 5px;
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 5px;
}

.back-card {
  margin: 0 -5px; /* Overlap cards slightly */
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.5));
  transition: transform 0.2s ease;
}

.back-card:hover {
  transform: translateY(-5px);
  z-index: 5;
}

/* Special orientation for player 5 (left side) */
.cards-left {
  flex-direction: row-reverse;
  left: -40px;
  bottom: 50%;
  transform: rotate(90deg);
}

/* Special orientation for player 6 (right side) */
.cards-right {
  right: -40px;
  bottom: 50%;
  transform: rotate(-90deg);
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
</style>
