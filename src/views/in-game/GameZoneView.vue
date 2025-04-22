<template>
  <div class="game-zone-container">
    <el-image
      :src="GameTable"
      style="height: 85%; width: 85%; position: absolute; user-select: none; z-index: 10"
      alt="Game Table"
      :draggable="false"
    />

    <!-- Win/Lose Modal -->
    <div v-if="showResultModal" class="result-modal">
      <div class="modal-content">
        <img :src="resultModalImage" alt="Game Result" />
      </div>
    </div>

    <div class="turn-container">
      <h1 style="color: white">{{ currentPlayerDisplay }}'s Turn</h1>
    </div>
    <div class="game-zone">
      <div class="card-table">
        <div class="game-cards">
          <div class="face-up-card" v-if="gameStore.faceUpCards[0]">
            <PlayerHand
              :cards="[cardToDisplayId(gameStore.faceUpCards[0])]"
              :show-cards="true"
              orientation="normal"
            />
          </div>

          <div class="face-up-card" v-if="isCurrentCardDrawnByCurrentPlayer">
            <PlayerHand
              :cards="[cardToDisplayId(gameStore.currentCard)]"
              :show-cards="true"
              orientation="normal"
            />
          </div>
          <div class="face-up-card" v-else>
            <div class="card-placeholder"></div>
          </div>

          <div class="face-up-card" v-if="gameStore.faceUpCards[1]">
            <PlayerHand
              :cards="[cardToDisplayId(gameStore.faceUpCards[1])]"
              :show-cards="true"
              orientation="normal"
            />
          </div>
        </div>

        <!-- Replace game message with player credit display -->
        <CashFlow :gameStore="gameStore" />
      </div>
    </div>
    <div class="table-container">
      <div
        v-for="position in 6"
        :key="position"
        :class="[
          `player-${position}`,
          {
            'active-player': activePlayers[position - 1] && isCurrentPlayer(position - 1),
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
            v-if="activePlayers[position - 1] && isCurrentPlayer(position - 1)"
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
              <!-- Show player pot from game store if player is active -->
              <template
                v-if="
                  activePlayers[position - 1] &&
                  gameStore.isMultiplayer &&
                  gameStore.playerPots[position - 1]
                "
              >
                P {{ gameStore.playerPots[position - 1] }}
              </template>
              <template
                v-else-if="
                  activePlayers[position - 1] && !gameStore.isMultiplayer && position - 1 === 0
                "
              >
                P {{ gameStore.pot }}
              </template>
              <template v-else> P 0 </template>
            </h1>
          </div>
          <PlayerHand
            :cards="playerCards[position - 1]"
            :show-cards="isCurrentPlayer(position - 1)"
            :orientation="position === 5 ? 'left' : position === 6 ? 'right' : 'normal'"
          />
        </div>
      </div>
      <div class="pot-amount">
        <h1 class="border">
          POT AMOUNT:
          {{
            gameStore.isMultiplayer
              ? gameStore.playerPots[gameStore.currentPlayerIndex]
              : gameStore.pot
          }}
        </h1>
        <h2 v-if="gameStore.currentBet > 0" class="border">
          CURRENT BET: {{ gameStore.currentBet }}
        </h2>
      </div>
    </div>

    <!-- Actions Container -->
    <div class="actions-container">
      <div v-if="!gameStore.gameStarted">
        <img
          src="../../assets/img/buttons/start-game.png"
          alt="fold-btn"
          class="start-cta"
          @click="startNewGame"
        />
      </div>
      <div v-else-if="gameStore.gameOver">
        <button class="game-button primary-button" @click="startNewGame">New Game</button>
        <h2 class="game-over-text">Game Over!</h2>
      </div>
      <div v-else-if="gameStore.awaitingEqualChoice">
        <h3 class="choice-prompt">Cards are equal! Choose:</h3>
        <div class="button-group">
          <button class="game-button choice-button" @click="handleChoice('higher')">Higher</button>
          <button class="game-button choice-button" @click="handleChoice('lower')">Lower</button>
        </div>
      </div>
      <div style="width: 100%" v-else>
        <GameCta :addCredit="addCredit" />
      </div>
    </div>

    <div class="timer-container">
      <h2 :class="['timer', { warning: timeRunningLow }]">Time: {{ formattedTimeRemaining }}</h2>
    </div>
    <div class="settings-container">
      <button class="settings-button" @click="toggleSettings">
        <span class="settings-icon">⚙️</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted, ref } from 'vue'
import GameTable from '@/assets/img/game-zone/Game-Table.svg'
import PlayerHand from '@/components/PlayerHand.vue'
import GameCta from '@/components/GameCta.vue'
import type { Card } from '@/interface/card'
import { usePlayerStore } from '@/stores/player-count'
import { usePlayerRegistration } from '@/stores/player'
import { useGameStore } from '@/stores/game-store'
import CashFlow from '@/components/CashFlow.vue'
import YouWinImage from '@/assets/img/game-zone/you-win.png'
import YouLoseImage from '@/assets/img/game-zone/you-lose.png'

// Result modal state
const showResultModal = ref(false)
const resultModalImage = ref('')

// --- Initialize game store ---
const gameStore = useGameStore()

const addCredit = ref(false)

// Current player's pot amount
const currentPlayerPot = computed(() => {
  if (gameStore.isMultiplayer && gameStore.playerPots.length > gameStore.currentPlayerIndex) {
    return gameStore.playerPots[gameStore.currentPlayerIndex]
  }
  return gameStore.pot
})

// Watch for changes in currentPlayerPot and revalidate addCredit
watch(currentPlayerPot, (newValue) => {
  console.log('player credit status : ', addCredit.value)

  if (newValue >= 1) {
    addCredit.value = true
  } else {
    addCredit.value = false
  }
})

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

// Convert card from game store to display format
function cardToDisplayId(card: Card | null): string {
  if (!card) return ''

  // If card already has an id property, use it
  if (card.id) return card.id

  // Otherwise construct from suit and rank
  return cardToId(card)
}

// Track if a user has drawn their card this turn to know when to display middle card
const isCurrentCardDrawnByCurrentPlayer = computed(() => {
  // Only show if current card exists AND currentBet is 0 (means card was drawn this turn)
  // In the game flow: bet is set > 0, then card is drawn, then bet is reset to 0
  return gameStore.currentCard !== null && gameStore.currentBet === 0 && gameStore.roundsPlayed > 0
})

// Keep track of player cards based on game state
const playerCards = computed(() => {
  const cards: string[][] = Array(6)
    .fill(0)
    .map(() => [])

  if (gameStore.gameStarted) {
    const currentPlayerIdx = gameStore.currentPlayerIndex

    // Show the left card
    if (gameStore.faceUpCards[0]) {
      cards[currentPlayerIdx][0] = cardToDisplayId(gameStore.faceUpCards[0])
    }

    // For middle card - only show if the player has drawn it this turn
    if (isCurrentCardDrawnByCurrentPlayer.value) {
      cards[currentPlayerIdx][1] = cardToDisplayId(gameStore.currentCard)
    } else {
      // Otherwise keep middle position hidden
      cards[currentPlayerIdx][1] = 'back'
    }

    // Show the right card
    if (gameStore.faceUpCards[1]) {
      cards[currentPlayerIdx][2] = cardToDisplayId(gameStore.faceUpCards[1])
    }

    // For other players, just show face-down cards
    for (let i = 0; i < playerCount.value; i++) {
      if (i !== currentPlayerIdx) {
        cards[i] = ['back', 'back', 'back']
      }
    }
  } else {
    // Before game starts, all players have face-down cards
    for (let i = 0; i < playerCount.value; i++) {
      cards[i] = ['back', 'back', 'back']
    }
  }

  return cards
})

// Active players computation
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

// Check if a player position is the current player
function isCurrentPlayer(playerIndex: number): boolean {
  return playerIndex === gameStore.currentPlayerIndex
}

// Current player name display
const currentPlayerDisplay = computed(() => {
  if (!gameStore.gameStarted) {
    return 'Game not started'
  }

  if (gameStore.isMultiplayer && players.value[gameStore.currentPlayerIndex]) {
    return players.value[gameStore.currentPlayerIndex].name
  }

  // Default to Player 1 for single player mode
  return players.value[0]?.name || 'Player 1'
})

// Current player's pot amount
// const currentPlayerPot = computed(() => {
//   if (gameStore.isMultiplayer && gameStore.playerPots.length > gameStore.currentPlayerIndex) {
//     return gameStore.playerPots[gameStore.currentPlayerIndex]
//   }
//   return gameStore.pot
// })

// Game actions
function startNewGame() {
  // Setup multiplayer if more than one active player
  if (playerCount.value > 1) {
    const activePlayers = players.value.slice(0, playerCount.value)
    gameStore.setupMultiplayerGame(activePlayers)
  } else {
    gameStore.isMultiplayer = false
  }

  gameStore.startGame()
}

// Draw third card and show win/lose modal
// function drawCard() {
//   gameStore.stopTurnTimer()

//   gameStore.drawThirdCard()

//   if (gameStore.message.includes('Win')) {
//     showWinModal()
//   } else if (gameStore.message.includes('Lose')) {
//     showLoseModal()
//   }
// }

function handleChoice(choice: 'higher' | 'lower') {
  gameStore.handleEqualCardsChoice(choice)
}

function toggleSettings() {
  // Implement settings panel logic here
  console.log('Settings toggled')
}

// Reset game when player count changes
watch(playerCount, () => {
  // Only reset if game is not in progress
  if (!gameStore.gameStarted || gameStore.gameOver) {
    setupGameDisplay()
  }
})

// Define the setupGameDisplay function to prevent errors
function setupGameDisplay() {
  // This is called when player count changes
  // We don't need to do anything here since playerCards is computed
  console.log('Game display reset due to player count change')
}

// Timer functionality
const formattedTimeRemaining = computed(() => {
  if (!gameStore.gameStarted || gameStore.gameOver) {
    return '10s'
  }
  return `${gameStore.turnTimeRemaining}s`
})

// Apply warning style when time is running low (3 seconds or less)
const timeRunningLow = computed(() => {
  return gameStore.turnTimeRemaining <= 3 && gameStore.turnTimerActive
})

// When user's turn is active, ensure timer is running
watch(
  () => gameStore.currentPlayerIndex,
  () => {
    if (gameStore.gameStarted && !gameStore.gameOver && !showResultModal.value) {
      // Only start the timer for the new player if no modal is showing
      gameStore.startTurnTimer()
    }
  },
)

// Clean up timer when component is unmounted
onUnmounted(() => {
  if (gameStore.turnTimerInterval) {
    clearInterval(gameStore.turnTimerInterval)
  }
})

// Show win modal
function showWinModal() {
  // Stop the turn timer while showing result
  gameStore.stopTurnTimer()

  resultModalImage.value = YouWinImage
  showResultModal.value = true

  // Auto-close after 4 seconds and only then process the next turn
  setTimeout(() => {
    showResultModal.value = false
    // Only restart the game flow after the modal has closed
    // This gives the player time to see their result
    if (gameStore.isMultiplayer && gameStore.gameStarted && !gameStore.gameOver) {
      // Wait a bit more before moving to next player
      setTimeout(() => {
        // Ensure the next player's turn timer doesn't start until modal is gone
        gameStore.startTurnTimer()
      }, 500)
    }
  }, 2000)
}

// Show lose modal
function showLoseModal() {
  // Stop the turn timer while showing result
  gameStore.stopTurnTimer()

  resultModalImage.value = YouLoseImage
  showResultModal.value = true

  // Auto-close after 4 seconds and only then process the next turn
  setTimeout(() => {
    showResultModal.value = false
    // Only restart the game flow after the modal has closed
    // This gives the player time to see their result
    if (gameStore.isMultiplayer && gameStore.gameStarted && !gameStore.gameOver) {
      // Wait a bit more before moving to next player
      setTimeout(() => {
        // Ensure the next player's turn timer doesn't start until modal is gone
        gameStore.startTurnTimer()
      }, 500)
    }
  }, 2000)
}

// Listen to state changes in game store to show modals
watch(
  () => gameStore.message,
  (newMessage, oldMessage) => {
    // Only trigger on message changes that are results
    if (oldMessage !== newMessage) {
      // Stop timer when showing results
      if (newMessage.includes('Win!')) {
        gameStore.stopTurnTimer()
        showWinModal()
      } else if (newMessage.includes('Lose')) {
        gameStore.stopTurnTimer()
        showLoseModal()
      }
    }
  },
)
</script>

<style scoped>
/* ...existing styles... */

.game-cards {
  display: flex;
  flex-direction: column; /* Change to column layout */
  justify-content: center;
  align-items: center;
  gap: 15px; /* Adjusted for vertical spacing */
  height: 100%; /* Ensure container uses available height */
  padding: 10px;
}

/* Adjust styling for table cards to match player hands */
.face-up-card,
.current-card {
  width: 100px;
  height: 140px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-placeholder {
  display: flex;

  width: 100px;
  height: 140px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border: 2px dashed rgba(255, 255, 255, 0.3);
}

/* Add container styling to ensure cards stay in bounds */
.card-table {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.timer {
  color: white;
  font-size: 1.5rem;
  transition: color 0.3s ease;
}

.timer.warning {
  color: #ff5252;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

/* Result modal styles */
.result-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 16000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  width: 80%; /* Fixed smaller width */
  animation: scaleIn 0.4s ease;
  z-index: 16000;
}

.modal-content img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* Ensures image maintains aspect ratio */
}

.start-cta {
  width: 330px;
  height: 80px;
  cursor: pointer;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.5);
  }
  to {
    transform: scale(1);
  }
}
</style>
