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
                {
                  'arrow-bottom': position === 3 || position === 4,
                  'arrow-left': position === 5,
                  'arrow-right': position === 6,
                },
              ]"
            ></div>
          </div>

          <div
            style="
              display: flex;
              flex-direction: column;
              justify-items: center;
              align-items: center;
            "
          >
            <h1 class="player-name">
              <!-- Show registered player name if available -->
              <template v-if="activePlayers[position - 1] && players[position - 1]">
                {{ players[position - 1].name }}
              </template>
              <template v-else> Empty </template>
            </h1>
            <h1 class="player-points">
              <!-- Show registered player credits if available -->
              <template v-if="activePlayers[position - 1] && players[position - 1]">
                P {{ players[position - 1].credits }}
              </template>
              <template v-else> P 0 </template>
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
    spades: 's',
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
