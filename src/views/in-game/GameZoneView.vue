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
              { 
                'arrow-bottom': position === 3 || position === 4,
                'arrow-left': position === 5,
                'arrow-right': position === 6
              }
            ]"></div>
          </div>
          
          <div style="width: 100%; height: 100%; display: flex; justify-items: center; align-items: center; flex-direction: column;" >
            
            <h1 class="player-name">
              <!-- Show registered player name if available -->
              <template v-if="activePlayers[position - 1] && players[position - 1]">
                {{ players[position - 1].name }}
              </template>
              <template v-else>
                Empty
              </template>
            </h1>
            <h1 class="player-points">
              <!-- Show registered player credits if available -->
              <template v-if="activePlayers[position - 1] && players[position - 1]">
                P {{ players[position - 1].credits }}
              </template>
              <template v-else>
                P 0
              </template>
            </h1>
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
import { createDeck } from '@/utils/createDeck'
import { shuffle } from '@/utils/shuffleDeck'
import type { Card } from '@/interface/card'
import { usePlayerStore } from '@/stores/player-count'
import { usePlayerRegistration } from '@/stores/player'

// --- Deck creation and shuffling ---
const deck = ref<Card[]>([])

// Load players from localStorage if not already loaded
const playerStore = usePlayerStore()
const registrationStore = usePlayerRegistration()
onMounted(() => {
  if (!registrationStore.players.length) {
    registrationStore.loadPlayersFromStorage()
  }
})

// Use player count from store if available, otherwise fallback to 6
const playerCount = computed(() => playerStore.playerCount ?? 6)
const players = computed(() => registrationStore.players)

// Helper to convert Card to cardId string (e.g., 'h10', 'sking')
function cardToId(card: Card): string {
  const suitMap = {
    hearts: 'h',
    diamonds: 'd',
    clubs: 'c',
    spades: 's'
  } as const
  const suit = suitMap[card.suit as keyof typeof suitMap] ?? 'x'
  const rank = typeof card.rank === 'string' ? card.rank : String(card.rank)
  return suit + rank
}

// Deal cards to players
function dealCards(deck: Card[], numPlayers: number, cardsPerPlayer = 3): string[][] {
  const hands: string[][] = Array.from({ length: 6 }, () => [])
  let deckIdx = 0
  for (let p = 0; p < numPlayers; p++) {
    for (let c = 0; c < cardsPerPlayer; c++) {
      if (deckIdx < deck.length) {
        hands[p].push(cardToId(deck[deckIdx++]))
      }
    }
  }
  return hands
}

// Shuffle and deal when component mounts or playerCount changes
const playerCards = ref<string[][]>([[], [], [], [], [], []])
function setupGame() {
  const newDeck = shuffle(createDeck())
  deck.value = newDeck
  playerCards.value = dealCards(newDeck, playerCount.value)
}
onMounted(setupGame)
watch(playerCount, setupGame)


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
/* Utility classes */
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.absolute {
  position: absolute;
}
.border-white {
  border: 2px solid white;
}
.text-white {
  color: white;
}
.text-shadow {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

/* Main containers */
.game-zone-container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/img/game-zone/play-background.png') center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Overlay containers */
.settings-container,
.timer-container,
.actions-container,
.game-zone,
.turn-container {
  position: absolute;
  z-index: 100;
  border: 2px solid white;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
}
.settings-container {
  width: 5%;
  height: 8%;
  bottom: 7%;
  right: 7%;
}
.timer-container {
  width: 13%;
  height: 13%;
  top: 7%;
  right: 7%;
}
.actions-container {
  width: 40%;
  height: 18%;
  bottom: 7%;
}
.game-zone {
  width: 10%;
  height: 80%;
  left: 7%;
}
.turn-container {
  width: 40%;
  height: 10%;
  top: 3%;
}

/* Table and player positions */
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
.player-1, .player-2, .player-3, .player-4 {
  position: absolute;
  width: 20%;
}
.player-1 { bottom: 0; left: 25%; }
.player-2 { bottom: 0; right: 25%; }
.player-3 { top: 0; left: 25%; }
.player-4 { top: 0; right: 25%; }
.player-5, .player-6 {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 15%;
  height: 35%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.player-5 { left: 0; }
.player-6 { right: 0; }

/* Pot styling */
.pot-amount {
  position: absolute;
  width: 20%;
  height: 30%;
}
.pot-amount h1 {
  color: white;
  font-size: 14px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  width: 100%;
  height: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid white;
}

/* Player spot states */
.active-player {
  background-color: rgba(255, 215, 0, 0.3);
  transition: background-color 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
}
.inactive-spot {
  background-color: rgba(30, 30, 30, 0.5);
  opacity: 0.6;
}

/* Player indicator and info containers */


.turn-indicator {
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 20;
}

.player-info-reverse { flex-direction: column-reverse; }
.player-info-left, .player-info-right {
  flex-direction: row;
  width: 100%;
  height: 100%;
}
.player-info-right { flex-direction: row-reverse; }

/* Player hand for side players */
.player-5 .player-hand, .player-6 .player-hand {
  width: 100%;
  height: 100%;
  margin: 0;
  justify-content: center;
  align-items: center;
}
.player-5 .card-wrapper, .player-6 .card-wrapper {
  margin: 0 5px;
  transform: none;
}
.player-5 .player-card:hover, .player-6 .player-card:hover {
  transform: translateY(-3px) rotate(0);
}

/* Remove old/unused card containers */
.cards-container, .cards-left, .cards-right, .back-card {
  display: none;
}

/* Center card highlight */
.center-card {
  transform: scale(1.5);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
}

/* Arrow animations */
.arrow-animation {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 20px solid gold;
  animation: pulse 1s infinite alternate, bounce 1.5s infinite;
  filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.7));
  z-index: 20;
  /* Center the arrow regardless of position */
  left: 50%;
  transform: translateX(-50%);
  top: -24px;
}

.arrow-bottom {
  top: auto;
  bottom: -24px;
  transform: translateX(-50%) rotate(180deg);
  animation: pulse 1s infinite alternate, bounce-reverse 1.5s infinite;
}

.arrow-right {
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-left: 20px solid gold;
  border-right: none;
  left: -35px;
  right: auto;
  top: 50%;
  transform: translateY(-50%) rotate(0);
  animation: pulse 1s infinite alternate, bounce-horizontal 1.5s infinite;
}

.arrow-left {
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  border-right: 20px solid gold;
  border-left: none;
  left: auto;
  right: -35px;
  top: 50%;
  transform: translateY(-50%) rotate(0);
  animation: pulse 1s infinite alternate, bounce-horizontal 1.5s infinite;
}

/* Player text */
.player-name, .player-points {
  color: white;
  font-size: 12px;
  margin: 2px 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
}

/* Animations */
@keyframes pulse {
  0% { opacity: 0.7; }
  100% { opacity: 1; }
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-10px); }
}

@keyframes bounce-reverse {
  0%, 100% { transform: translateX(-50%) translateY(0) rotate(180deg); }
  50% { transform: translateX(-50%) translateY(10px) rotate(180deg); }
}

@keyframes bounce-horizontal {
  0%, 100% { transform: translateY(-50%) translateX(0); }
  50% { transform: translateY(-50%) translateX(-10px); }
}
</style>