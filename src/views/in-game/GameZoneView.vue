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
            <img v-else :src="MysteryCard" alt="Shadow Question" class="mystery-card" />
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

        <CashFlow :gameStore="gameStore" />
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
          src="../../assets/img/buttons/actions/start-game.png"
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
      <CountdownTimer />
    </div>

    <!-- Main Menu -->
    <div class="settings-container">
      <img
        src="../../assets/img/buttons/main-menu/menu-btn.png"
        alt="how-to-play-btn"
        class="menu-btn"
        @click="toggleMainMenu"
      />
    </div>

    <MainMenuDialog></MainMenuDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import GameTable from '@/assets/img/game-zone/table.svg'
import MysteryCard from '@/assets/img/cards/special-cards/mystery-card.svg'
import GameCta from '@/components/gameplay-actions/GameCta.vue'
import { usePlayerStore } from '@/stores/player-count'
import { usePlayerRegistration } from '@/stores/player'
import { useGameStore } from '@/stores/game-store'
import eventBus from '@/eventBus'
import CountdownTimer from '@/components/utilities/CountdownTimer.vue'
import MainMenuDialog from '@/components/dialog/MainMenuDialog.vue'
import CashFlow from '@/components/currency/CashFlow.vue'
import PlayerHand from '@/components/game-table/PlayerHand.vue'

// Import utility functions
import { cardToDisplayId } from '@/utils/gameplay/deck/cardUtil'
import {
  showResultModal,
  resultModalImage,
  showWinModal,
  showLoseModal,
  showFoldModal,
} from '@/utils/gameplay/pop-ups/modalUtil'
import {
  isCurrentPlayer,
  getActivePlayers,
  calculatePlayerCards,
} from '@/utils/gameplay/player/playerUtil'

// --- Initialize game store ---
const gameStore = useGameStore()

const addCredit = ref(false)

// Current player's pot amount - simplified computation
const currentPlayerPot = computed(() => {
  const playerPot = gameStore.playerPots[gameStore.currentPlayerIndex]
  return playerPot !== undefined ? playerPot : 0
})

// Function to update credit status
function updateCreditStatus() {
  const credits = currentPlayerPot.value
  console.log('Updating credit status, current credits:', credits)
  addCredit.value = credits > 0
}

// Check credits immediately on mount and after game start
onMounted(() => {
  if (!registrationStore.players.length) {
    registrationStore.loadPlayersFromStorage()
  }

  // Initial credit status check with delay to ensure store is loaded
  setTimeout(() => {
    updateCreditStatus()
    console.log('Initial credit status set to:', addCredit.value)
  }, 200)
})

// Watch for changes in player credits
watch(currentPlayerPot, (newValue) => {
  console.log('Player credits changed:', newValue)
  updateCreditStatus()
})

// Watch for game start
watch(
  () => gameStore.gameStarted,
  (isStarted) => {
    if (isStarted) {
      setTimeout(() => {
        updateCreditStatus()
        console.log('Credit status after game start:', addCredit.value)
      }, 200) // Delay to ensure player pots are updated
    }
  },
)

// Watch for changes in current player index
watch(
  () => gameStore.currentPlayerIndex,
  () => {
    setTimeout(() => {
      updateCreditStatus()
      console.log('Credit status after player change:', addCredit.value)
    }, 100)
  },
)

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

  if (players.value[gameStore.currentPlayerIndex]) {
    return players.value[gameStore.currentPlayerIndex].name
  }

  return 'Player'
})

// Helper to get player points for a specific position
function getPlayerPoints(position: number): number {
  if (activePlayers.value[position]) {
    if (gameStore.playerPots[position] !== undefined) {
      return gameStore.playerPots[position]
    }
  }
  return 0
}

// Game actions
function startNewGame() {
  const activePlayers = players.value.slice(0, playerCount.value)
  gameStore.setupGame(activePlayers)
  gameStore.startGame()

  // Update credit status after starting game with a delay
  setTimeout(() => {
    updateCreditStatus()
    console.log('Credit status after game start:', addCredit.value)
  }, 300)
}

function handleChoice(choice: 'higher' | 'lower') {
  gameStore.handleEqualCardsChoice(choice)
}

// Define the setupGameDisplay function to prevent errors
function setupGameDisplay() {
  // This is called when player count changes
  console.log('Game display reset due to player count change')
}

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

const mainMenuVisible = ref(false)

const toggleMainMenu = () => {
  eventBus.emit('toggle-main-menu')
}

onMounted(() => {
  eventBus.on('untoggle-main-menu', (newValue) => {
    mainMenuVisible.value = newValue
    console.log(mainMenuVisible.value)
  })
})

watch(mainMenuVisible, (newValue) => {
  if (newValue) {
    gameStore.haltTurnTimer()
  } else {
    gameStore.resumeTurnTimer()
  }
})

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
