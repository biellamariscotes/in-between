<template>
  <div class="game-zone-container">
    <el-image
      :src="GameTable"
      style="height: 85%; width: 85%; position: absolute; user-select: none; z-index: 10"
      alt="Game Table"
      :draggable="false"
    />

    <!-- Result Modal Component -->
    <ResultModal :show="showResultModal" :image="resultModalImage" />

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

          <div class="face-up-card" v-if="gameStore.faceUpCards[0]">
            <PlayerHand
              v-if="gameStore.currentCard"
              :cards="[cardToDisplayId(gameStore.currentCard)]"
              :show-cards="true"
              orientation="normal"
            />
            <img v-else :src="Shadowquestion" alt="Shadow Question" class="shadowquestion" />
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

        <div class="credit-display">
          <h2>Credit: {{ currentPlayerPot }}</h2>
        </div>
      </div>
    </div>

    <div class="table-container">
      <!-- Player Position Components -->
      <PlayerPosition
        v-for="position in 6"
        :key="position"
        :position="position"
        :isActive="activePlayers[position - 1]"
        :isCurrentPlayer="isCurrentPlayer(position - 1)"
        :playerName="activePlayers[position - 1] ? (players[position - 1]?.name ?? '') : ''"
        :playerPoints="getPlayerPoints(position - 1)"
        :cards="playerCards[position - 1] || []"
      />

      <!-- Communal Pot Component -->
      <CommunalPot :potAmount="gameStore.communalPot" :currentBet="gameStore.currentBet" />
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
        <GameCta />
      </div>
    </div>

    <div class="timer-container">
      <CountdownTimer />
    </div>

    <!-- Main Menu -->
    <div class="settings-container">
      <button class="settings-button" @click="toggleMainMenu">
        <span class="settings-icon">⚙️</span>
      </button>
    </div>

    <MainMenuDialog></MainMenuDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import GameTable from '@/assets/img/game-zone/Game-Table.svg'
import Shadowquestion from '@/assets/img/game-zone/shadowquestion.svg'
import GameCta from '@/components/GameCta.vue'
import { usePlayerStore } from '@/stores/player-count'
import { usePlayerRegistration } from '@/stores/player'
import { useGameStore } from '@/stores/game-store'
import eventBus from '@/eventBus'

// Import utility functions
import { cardToDisplayId } from '@/utils/cardUtils'
import {
  showResultModal,
  resultModalImage,
  showWinModal,
  showLoseModal,
  showFoldModal,
} from '@/utils/modalUtils'
import { isCurrentPlayer, getActivePlayers, calculatePlayerCards } from '@/utils/playerUtils'

// --- Initialize game store ---
const gameStore = useGameStore()

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

// Track if a user has drawn their card this turn to know when to display middle card
const isCurrentCardDrawnByCurrentPlayer = computed(() => {
  // Only show if current card exists AND currentBet is 0 (means card was drawn this turn)
  return gameStore.currentCard !== null && gameStore.currentBet === 0 && gameStore.roundsPlayed > 0
})

// Get player cards from utility
const playerCards = calculatePlayerCards()

// Active players computation
const activePlayers = computed(() => getActivePlayers(playerCount.value))

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
const currentPlayerPot = computed(() => {
  if (gameStore.isMultiplayer && gameStore.playerPots.length > gameStore.currentPlayerIndex) {
    return gameStore.playerPots[gameStore.currentPlayerIndex]
  }
  return gameStore.pot
})

// Helper to get player points for a specific position
function getPlayerPoints(position: number): number {
  if (activePlayers.value[position]) {
    if (gameStore.isMultiplayer && gameStore.playerPots[position] !== undefined) {
      return gameStore.playerPots[position]
    } else if (!gameStore.isMultiplayer && position === 0) {
      return gameStore.pot
    }
  }
  return 0
}

// Game actions
function startNewGame() {
  // Setup multiplayer if more than one active playeruseGameStore useGameStore
  if (playerCount.value > 1) {
    const activePlayers = players.value.slice(0, playerCount.value)
    gameStore.setupMultiplayerGame(activePlayers)
  } else {
    gameStore.isMultiplayer = false
  }

  gameStore.startGame()
}

function handleChoice(choice: 'higher' | 'lower') {
  gameStore.handleEqualCardsChoice(choice)
}

// Define the setupGameDisplay function to prevent errors
function setupGameDisplay() {
  // This is called when player count changes
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

// ------- MAIN MENU LOGIC ---------

const toggleMainMenu = () => {
  eventBus.emit('toggle-main-menu')
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
      } else if (newMessage.includes('Fold') || newMessage.includes('folded')) {
        gameStore.stopTurnTimer()
        showFoldModal()
      }
    }
  },
)

// Reset game when player count changes
watch(playerCount, () => {
  // Only reset if game is not in progress
  if (!gameStore.gameStarted || gameStore.gameOver) {
    setupGameDisplay()
  }
})
</script>

<style scoped>
/* ...existing styles... */

.game-cards {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  height: 100%;
  padding: 10px;
}

/* Adjust styling for table cards to match player hands */
.face-up-card,
.current-card {
  width: 140px;
  height: 220px;
  border-radius: 10px;
  /* background-color: rgba(0, 0, 0, 0.2); */

  display: flex;
  justify-content: center;
  align-items: center;
}

.shadowquestion {
  width: 1000px;
  height: 250px;
}

.card-placeholder {
  display: flex;
  width: 100px;
  height: 140px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border: 2px dashed rgba(255, 255, 255, 0.3);
}

/* Add styling for the credit display */
.credit-display {
  color: white;
  text-align: center;
  margin-top: 15px;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
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

/* .timer {
  color: white;
  font-size: 1.5rem;
  transition: color 0.3s ease;
}

.timer.warning {
  color: #ff5252;
  animation: pulse 1s infinite;
} */

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
