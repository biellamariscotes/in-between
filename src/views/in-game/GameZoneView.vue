<template>
  <div class="game-zone-container">
    <!-- Main game table background -->
    <el-image
      :src="GameTable"
      style="height: 85%; width: 85%; position: absolute; user-select: none; z-index: 10"
      alt="Game Table"
      :draggable="false"
    />

    <!-- Modal for displaying game results -->
    <ResultModal :show="showResultModal" :image="resultModalImage" />
    
    <!-- Game Over Modal -->
    <GameOverModal 
      :show="showGameOverModal" 
      @close="showGameOverModal = false" 
    />

    <!-- Main menu dialog component -->
    <MainMenuDialog></MainMenuDialog>

    <!-- ////// CURRENT PLAYER TURN DISPLAY ////// -->
    <div class="turn-container">
      <h1>{{ currentPlayerDisplay }}'s Turn</h1>
    </div>

    <!-- ////// CARD DISPLAY AREA ////// -->
    <div class="game-zone">
      <div class="card-table">
        <div class="game-cards">
          <!-- First face-up card display -->
          <div class="face-up-card" v-if="gameStore.faceUpCards[0]">
            <PlayerHand
              :cards="[cardToDisplayId(gameStore.faceUpCards[0])]"
              :show-cards="true"
              orientation="normal"
            />
          </div>

          <!-- Current card being played display -->
          <div class="face-up-card" v-if="gameStore.faceUpCards[0]">
            <PlayerHand
              v-if="gameStore.currentCard"
              :cards="[cardToDisplayId(gameStore.currentCard)]"
              :show-cards="true"
              orientation="normal"
            />
            <img v-else :src="MysteryCard" alt="Shadow Question" class="mystery-card" />
          </div>

          <!-- Placeholder for card space when empty -->
          <div class="face-up-card" v-else>
            <div class="card-placeholder"></div>
          </div>

          <!-- Second face-up card display -->
          <div class="face-up-card" v-if="gameStore.faceUpCards[1]">
            <PlayerHand
              :cards="[cardToDisplayId(gameStore.faceUpCards[1])]"
              :show-cards="true"
              orientation="normal"
            />
          </div>
        </div>

        <!-- Cash flow component for betting visualization -->
        <CashFlow :gameStore="gameStore" />
      </div>
    </div>

    <!-- ////// PLAYER POSITIONS ////// -->
    <div class="table-container">
      <!-- Render player positions around the table -->
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

      <!-- Communal pot display -->
      <CommunalPot :potAmount="gameStore.communalPot" :currentBet="gameStore.currentBet" />
    </div>

    <!-- ////// GAME ACTIONS ////// -->
    <div class="actions-container">
      <!-- Game start button - shown when game hasn't started -->
      <div v-if="!gameStore.gameStarted">
        <img
          src="../../assets/img/buttons/actions/start-game.png"
          alt="fold-btn"
          class="start-cta"
          @click="startGameLocally"
        />
      </div>

      <!-- Game over state - show new game button -->
      <div v-else-if="gameStore.gameOver">
        <!-- No buttons here anymore, using modal instead -->
      </div>

      <!-- Equal cards choice buttons (higher/lower) -->
      <div v-else-if="gameStore.awaitingEqualChoice">
        <h3 class="choice-prompt">Cards are equal! Choose:</h3>
        <div class="button-group">
          <button class="game-button choice-button" @click="handleChoice('higher')">Higher</button>
          <button class="game-button choice-button" @click="handleChoice('lower')">Lower</button>
        </div>
      </div>

      <!-- Normal gameplay actions -->
      <div style="width: 100%" v-else>
        <div v-if="cashOutCredit">
          <p>cashout</p>
        </div>
        <div v-else>
          <GameCta :addCredit="addCredit" />
        </div>
      </div>
    </div>

    <!-- ////// TIMER ////// -->
    <div class="timer-container">
      <CountdownTimer />
    </div>

    <!-- ////// MAIN MENU BUTTON ////// -->
    <div class="settings-container">
      <img
        src="../../assets/img/buttons/main-menu/menu-btn.png"
        alt="how-to-play-btn"
        class="menu-btn"
        @click="toggleMainMenu"
      />
    </div>
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
import { useGameLifeCycle } from '@/composables/useGameLifeCycle'
import GameOverModal from '@/components/dialog/GameOverModal.vue'
import eventBus from '@/eventBus'

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

// Add game over modal state
const showGameOverModal = ref(false)


// ─────────────────────────────
// Store Intialization
// ─────────────────────────────
const gameStore = useGameStore()
const { startNewGame } = useGameLifeCycle()

// Credit management flags
const addCredit = ref(false)
const cashOutCredit = ref(false)

// ─────────────────────────────
// Computed Properties
// ─────────────────────────────

// Compute current player's pot amount
const currentPlayerPot = computed(() => {
  const playerPot = gameStore.playerPots[gameStore.currentPlayerIndex]
  return playerPot !== undefined ? playerPot : 0
})

// ─────────────────────────────
// Credit Management
// ─────────────────────────────

/**
 * Updates the credit status for the current player
 * Used to determine if player needs to add more credits or can cash out
 */
function updateCreditStatus() {
  const credits = currentPlayerPot.value
  console.log('Updating credit status, current credits:', credits)
  addCredit.value = credits > 99
}

// ─────────────────────────────
// Player Management
// ─────────────────────────────

// Access player stores
const playerStore = usePlayerStore()
const registrationStore = usePlayerRegistration()

// Get player count from store or default to 6
const playerCount = computed(() => playerStore.playerCount ?? 6)
const players = computed(() => registrationStore.players)

// Get player cards from utility function
const playerCards = calculatePlayerCards()

// Determine which player positions are active
const activePlayers = computed(() => getActivePlayers(playerCount.value))

// Display name for current player
const currentPlayerDisplay = computed(() => {
  if (!gameStore.gameStarted) {
    return 'Game not started'
  }

  if (players.value[gameStore.currentPlayerIndex]) {
    return players.value[gameStore.currentPlayerIndex].name
  }

  return 'Player'
})

/**
 * Gets points for a specific player position
 * @param position - The position index of the player (0-based)
 * @returns The player's points or 0 if player doesn't exist
 */
function getPlayerPoints(position: number): number {
  if (activePlayers.value[position]) {
    if (gameStore.playerPots[position] !== undefined) {
      return gameStore.playerPots[position]
    }
  }
  return 0
}

// Game actions - Rename to avoid conflict with imported startNewGame
function startGameLocally() {
  const activePlayers = players.value.slice(0, playerCount.value)
  gameStore.setupGame(activePlayers)
  gameStore.startGame()

  // Update credit status after starting game with a delay
  setTimeout(() => {
    updateCreditStatus()
    console.log('Credit status after game start:', addCredit.value)
  }, 300)
}

/**
 * Handles player choice when cards are equal
 * @param choice - 'higher' or 'lower' choice made by player
 */
function handleChoice(choice: 'higher' | 'lower') {
  gameStore.handleEqualCardsChoice(choice)
}

/**
 * Resets game display when player count changes
 */
function setupGameDisplay() {
  console.log('Game display reset due to player count change')
}

// ─────────────────────────────
// Main Menu Management
// ─────────────────────────────

const mainMenuVisible = ref(false)

/**
 * Toggles main menu visibility via event bus
 */
const toggleMainMenu = () => {
  eventBus.emit('toggle-main-menu')
}

// ─────────────────────────────
// Lifecycle Hooks
// ─────────────────────────────

onMounted(() => {
  // Load players from storage if not already loaded
  if (!registrationStore.players.length) {
    registrationStore.loadPlayersFromStorage()
  }

  // Initial credit status check with delay to ensure store is loaded
  setTimeout(() => {
    updateCreditStatus()
    console.log('Initial credit status set to:', addCredit.value)
  }, 200)

  // Set up event listener for main menu toggle
  eventBus.on('untoggle-main-menu', (newValue) => {
    mainMenuVisible.value = newValue
    console.log(mainMenuVisible.value)
  })
})

onUnmounted(() => {
  // Clean up timer when component is unmounted
  if (gameStore.turnTimerInterval) {
    clearInterval(gameStore.turnTimerInterval)
  }
})

// ─────────────────────────────
// Watchers
// ─────────────────────────────

// Watch: Changes in player credits
watch(currentPlayerPot, (newValue) => {
  console.log('Player credits changed:', newValue)
  updateCreditStatus()
})

// Watch: Game start to update credit status
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

// Watch: Changes in current player
watch(
  () => gameStore.currentPlayerIndex,
  () => {
    setTimeout(() => {
      updateCreditStatus()
      console.log('Credit status after player change:', addCredit.value)
    }, 100)
  },
)

// Watch: Player turn changes to manage timer
watch(
  () => gameStore.currentPlayerIndex,
  () => {
    if (gameStore.gameStarted && !gameStore.gameOver && !showResultModal.value) {
      // Only start the timer for the new player if no modal is showing
      gameStore.startTurnTimer()
    }
  },
)

// Watch: Menu visibility to pause timer when menu is open
watch(mainMenuVisible, (newValue) => {
  if (newValue) {
    gameStore.haltTurnTimer()
  } else {
    gameStore.resumeTurnTimer()
  }
})

// Watch: Game messages to display appropriate modals
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

// Watch: Reset game when player count changes
watch(playerCount, () => {
  // Only reset if game is not in progress
  if (!gameStore.gameStarted || gameStore.gameOver) {
    setupGameDisplay()
  }
})

// Watch for game over state
watch(
  () => gameStore.gameOver,
  (isGameOver) => {
    if (isGameOver) {
      showGameOverModal.value = true
    }
  }
)
</script>
