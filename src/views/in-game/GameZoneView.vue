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
      <h1>{{ currentPlayerDisplay }}'s Turn</h1>
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

    <div class="settings-container">
      <button class="settings-button" @click="toggleSettings">
        <span class="settings-icon">⚙️</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'
import GameTable from '@/assets/img/game-zone/Game-Table.svg'
import Shadowquestion from '@/assets/img/game-zone/shadowquestion.svg'
import PlayerHand from '@/components/PlayerHand.vue'
import GameCta from '@/components/GameCta.vue'
import { usePlayerStore } from '@/stores/player-count'
import { usePlayerRegistration } from '@/stores/player'
import { useGameStore } from '@/stores/game-store'
import CountdownTimer from '@/components/CountdownTimer.vue'

// Import new components
import PlayerPosition from '@/components/PlayerPosition.vue'
import CommunalPot from '@/components/CommunalPot.vue'
import ResultModal from '@/components/ResultModal.vue'

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
  console.log('Game display reset due to player count change')
}

// Clean up timer when component is unmounted
onUnmounted(() => {
  if (gameStore.turnTimerInterval) {
    clearInterval(gameStore.turnTimerInterval)
  }
})

// Listen to state changes in game store to a modals
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
</script>
