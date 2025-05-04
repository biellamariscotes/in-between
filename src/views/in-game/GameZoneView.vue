<template>
  <div
    class="game-zone-container"
    :class="{
      'modal-active': showResultModal || showGameOverModal,
      'modal-win': modalType === 'win',
      'modal-lose': modalType === 'lose',
      'modal-fold': modalType === 'fold',
    }"
  >
    <!-- Main game table background -->
    <el-image
      :src="GameTable"
      style="height: 90%; width: 90%; position: absolute; user-select: none; z-index: 10"
      alt="Game Table"
      :draggable="false"
    />

    <!-- Modal for displaying game results -->
    <ResultModal :show="showResultModal" :image="resultModalImage" />

    <!-- Game Over Modal -->
    <GameOverModal :show="showGameOverModal" @close="showGameOverModal = false" />

    <!-- Main menu dialog component -->
    <MainMenuDialog></MainMenuDialog>

    <!-- ////// CURRENT PLAYER TURN DISPLAY ////// -->

    <div class="turn-container">
      <h1 v-if="gameStore.gameStarted">{{ currentPlayerDisplay }}'s Turn</h1>
      <h1 v-else>Game Not Started</h1>
    </div>

    <!--////// CARD COUNT //////  -->
    <div>
      <CardCount />
    </div>

    <!-- ////// CARD DISPLAY AREA ////// -->
    <div class="game-zone">
      <div class="card-table">
        <div id="btn4" class="game-cards">
          <!-- First face-up card display -->
          <div class="face-up-card card-draw-in" v-if="gameStore.faceUpCards[0]">
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
              class="card-flip-reveal"
            />
            <img
              v-else
              :src="MysteryCard"
              alt="Shadow Question"
              class="mystery-card card-draw-mystery"
            />
          </div>
          <!-- Second face-up card display -->
          <div class="face-up-card card-draw-in" v-if="gameStore.faceUpCards[1]">
            <PlayerHand
              :cards="[cardToDisplayId(gameStore.faceUpCards[1])]"
              :show-cards="true"
              orientation="normal"
            />
          </div>
        </div>

        <!-- Cash flow component for betting visualization -->
        <CashFlow
          :gameStore="gameStore"
          :cashOutCredit="cashOutCredit"
          :handleCashInCredit="handleCashInCredit"
          @update:cashOutCredit="cashOutCredit = $event"
        />
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
        :playerName="
  activePlayers[position - 1] && players[position - 1]?.name
    ? players[position - 1]!.name!.toUpperCase()
    : ''
"
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
          id="btn1"
        />
      </div>

      <!-- Equal cards choice buttons (higher/lower) -->
      <div
        v-else-if="gameStore.awaitingEqualChoice"
        style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 15px;
        "
      >
        <img
          src="../../assets/img/buttons/cta/pick-side.png"
          alt="question-text"
          style="height: 80%; width: 80%; margin-bottom: 3%; margin-top: 3%"
        />
        <div
          style="
            display: flex;
            justify-content: center;
            gap: 10%;
            align-items: center;
            flex-direction: row;
          "
        >
          <img
            src="../../assets/img/buttons/cta/higher-button.png"
            alt="Higher"
            @click="gameStore.handleEqualCardsChoice('higher')"
            style="height: 30%; width: 30%; margin-bottom: 3%"
          />
          <img
            src="../../assets/img/buttons/cta/lower-button.png"
            alt="Lower"
            @click="gameStore.handleEqualCardsChoice('lower')"
            style="height: 30%; width: 30%; margin-bottom: 3%"
          />
        </div>
      </div>

      <!-- Normal gameplay actions -->
      <!-- Cash Out Form -->
      <div style="width: 100%" v-else>
        <div v-if="cashOutCredit" class="cashout-container">
          <el-form @keydown="preventEnter">
            <img
              src="../../assets/img/cash-out/cashout-text.png "
              alt="input-text"
              class="input-credits-text"
            />

            <el-input size="large" v-model="cashOutAmout" placeholder="Cashout Amount..." />

            <img
              src="../../assets/img/cash-out/cashout-submit.png"
              alt="add-btn"
              class="add-credits-cta"
              @click="isCashOutDialog = true"
            />

            <img
              src="../../assets/img/buttons/actions/ekis.png"
              alt="ekis-btn"
              class="back-cta"
              @click="handleBackCashOut"
            />
          </el-form>

          <el-dialog v-model="isCashOutDialog" title="Warning" width="700" align-center>
            <div class="dialog-title">
              <h1>WITHDRAW CREDITS?</h1>
              <P>You are going to cashout</P>
              <p>amount</p>
            </div>
            <template #footer>
              <div class="dialog-footer">
                <img
                  src="../../assets/img/cash-out/cash-out-continue.png"
                  alt="ekis-btn"
                  class="cashout-dialog-btn"
                  @click="handleSubmitCashOut"
                />
                <img
                  src="../../assets/img/cash-out/cash-out-quit.png"
                  alt="ekis-btn"
                  class="cashout-dialog-btn"
                  @click="handleCashOutAndQuit"
                />
              </div>
            </template>
          </el-dialog>
        </div>

        <div v-else class="gameCta-wrapper">
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

    <!-- ////// PLAYER HISTORY////// -->
    <EventsHistory></EventsHistory>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, provide } from 'vue'
import GameTable from '@/assets/img/game-zone/table.svg'
import MysteryCard from '@/assets/img/cards/special-cards/mystery-card.svg'
import GameCta from '@/components/gameplay-actions/GameCta.vue'
import { usePlayerStore } from '@/stores/player-count'
import { usePlayerRegistration } from '@/stores/player'
import { useGameStore } from '@/stores/game-store'
// import { useGameLifeCycle } from '@/composables/useGameLifeCycle'
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
  modalType, // Import the new modalType ref
} from '@/utils/gameplay/pop-ups/modalUtil'
import {
  isCurrentPlayer,
  getActivePlayers,
  calculatePlayerCards,
} from '@/utils/gameplay/player/playerUtil'
import CardCount from '@/components/utilities/CardCount.vue'
import EventsHistory from '@/components/utilities/EventsHistory.vue'

// Add game over modal state
const showGameOverModal = ref(false)

// ─────────────────────────────
// Store Intialization
// ─────────────────────────────
const gameStore = useGameStore()
// const { startNewGame } = useGameLifeCycle()
const playerStoreRegistration = usePlayerRegistration()

// Credit management flags
const addCredit = ref(false)
const cashOutCredit = ref(false)
const cashInCredit = ref(false)
const cashOutAmout = ref()
const isCashOutDialog = ref(false)

function handleBackToMainCta() {
  addCredit.value = true
}

provide('addCredit', handleBackToMainCta)

// ─────────────────────────────
// Computed Properties
// ─────────────────────────────

// Compute current player's pot amount

const currentPlayerPot = computed(() => {
  const currentPlayer = gameStore.players[gameStore.currentPlayerIndex]
  const playerPot = currentPlayer ? currentPlayer.credits : 0
  console.log('Current player pot:', playerPot)
  return playerPot !== undefined ? playerPot : 0
})

// ─────────────────────────────
// Credit Management
// ─────────────────────────────

/**
 * Updates the credit status for the current player
 * Used to determine if player can cash out (has enough credits) or needs to add more
 */
 function updateCreditStatus() {
  // Get player credits directly
  const playerCredits = currentPlayerPot.value ?? 0
  
  // Set the threshold for showing cash out option (when player has enough credits)
  const minimumCreditsForCashout = 100
  
  console.log('Updating credit status, current credits:', playerCredits)
  
  // addCredit = true means "show cash out button" in your implementation
  // So we set it to true when player has ENOUGH credits to cash out
  addCredit.value = playerCredits >= minimumCreditsForCashout
}

const handleCashInCredit = () => {
  addCredit.value = false
  cashOutCredit.value = false
  cashInCredit.value = true
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
  const player = players.value[gameStore.currentPlayerIndex]
  if (player && player.name) {
    return player.name.charAt(0).toUpperCase() + player.name.slice(1)
  }

  return 'Player'
})

const preventEnter = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
  }
}

/**
 * Gets points for a specific player position
 * @param position - The position index of the player (0-based)
 * @returns The player's points or 0 if player doesn't exist
 */

function getPlayerPoints(position: number): number {
  if (activePlayers.value[position]) {
    const player = gameStore.players[position]
    if (player !== undefined) {
      return player.credits ?? 0
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
// function handleChoice(choice: 'higher' | 'lower') {
//   gameStore.handleEqualCardsChoice(choice)
// }

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
  gameStore.startTurnTimer()
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
  },
)

const handleBackCashOut = () => {
  cashOutCredit.value = false
}

const handleSubmitCashOut = () => {
  if (cashOutAmout.value <= 0) return
  try {
    const index = gameStore.currentPlayerIndex

    // Ensure the player object exists
    if (!gameStore.players[index]) {
      gameStore.players[index] = {
        id: '',
        name: '',
        credits: 0,
        randomizedPosition: 0,
        isTurn: false,
        isTurnComplete: false,
      }
    }

    // Update in-game credits
    gameStore.players[index].credits =
      (gameStore.players[index].credits ?? 0) - Number(cashOutAmout.value)

    const playerId = gameStore.players[index]?.id

    if (playerId) {
      const playerIndex = playerStoreRegistration.players.findIndex((p) => p.id === playerId)
      if (playerIndex !== -1) {
        const currentCredits = playerStoreRegistration.players[playerIndex].credits || 0
        playerStoreRegistration.players[playerIndex].credits =
          currentCredits - Number(cashOutAmout.value)
      }

      cashOutAmout.value = 0
      isCashOutDialog.value = false
    }
  } catch (error) {
    console.error('Error adding credits:', error)
  }
}

const handleCashOutAndQuit = () => {
  handleSubmitCashOut()
  try {
    const index = gameStore.currentPlayerIndex
    const playerId = gameStore.players[index]?.id

    if (playerId) {
      playerStoreRegistration.players = playerStoreRegistration.players.filter(
        (p) => p.id !== playerId,
      )

      localStorage.setItem('players', JSON.stringify(playerStoreRegistration.players))

      gameStore.players.splice(index, 1)

      gameStore.saveStateToLocalStorage()

      isCashOutDialog.value = false
    }
  } catch (error) {
    console.error('Error removing player:', error)
  }
}
</script>

<style lang="css" scoped>
.el-form {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
}

.input-credits-text {
  width: 250px;
  height: 30px;
}

.back-cta {
  position: absolute;
  top: 0;
  left: 5%;
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.add-credits-cta {
  position: absolute;
  top: 30%;
  right: -50%;
  width: 190px;
  height: 65px;
  cursor: pointer;
}

.dialog-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: black;
}

.dialog-title h1 {
  font-size: 60px;
}

.dialog-title p {
  font-size: 30px;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.dialog-footer img {
  cursor: pointer;
}

.cashout-dialog-btn {
  width: 280px;
  height: 90px;
}

:deep(.el-input) {
  width: 170px;
}

:deep(.el-input__wrapper) {
  box-shadow: none;
  background-color: black;
}

:deep(.el-input__inner) {
  color: white;
  font-family: 'Baumans';
}
</style>
