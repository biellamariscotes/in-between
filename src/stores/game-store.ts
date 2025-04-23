import { defineStore } from 'pinia'
import { createDeck } from '@/utils/createDeck'
import { shuffle } from '@/utils/shuffleDeck'
import { cards } from '@/utils/data/cards'
import type { Card, GameState } from '@/interface/card'
import type { Player } from '@/interface/player'
import { usePlayerRegistration } from '@/stores/player'
import { usePlayerStore } from '@/stores/player-count'

export const useGameStore = defineStore('game', {
  state: (): GameState => {
    if (!this?.freshStart) {
      // Check if freshStart flag exists and is true
      const savedState = localStorage.getItem('gameState')
      if (savedState) {
        try {
          return JSON.parse(savedState) as GameState
        } catch (e) {
          console.error('Failed to parse saved game state:', e)
          // Fall through to create a new state
        }
      }
    }

    return {
      freshStart: false,
      deck: [] as Card[],
      faceUpCards: [null, null] as (Card | null)[],
      currentCard: null as Card | null,
      currentBet: 0,
      message: '',
      gameOver: false,
      equalCardsChoice: null,
      awaitingEqualChoice: false,
      players: [] as Player[],
      currentPlayerIndex: 0,
      roundsPlayed: 0,
      winnings: [],
      playerPots: [],
      betsPlaced: [],
      gameStarted: false,
      // New properties
      communalPot: 0,
      rakeAmount: 100,
      // Timer-related state
      turnTimeRemaining: 10,
      turnTimerActive: false,
      turnTimerInterval: null as number | null,
      turnTimerHalted: false,
      // Add isMultiplayer flag with default value
      isMultiplayer: true,
    }
  },

  getters: {
    getTotalPot: (state) => {
      return state.playerPots.reduce((sum, pot) => sum + pot, 0)
    },

    getCurrentPlayerPot: (state) => {
      return state.playerPots[state.currentPlayerIndex] || 0
    },

    canPlaceBet: (state) => {
      return !state.gameOver && !state.awaitingEqualChoice && state.currentBet === 0
    },

    canDrawCard: (state) => {
      return !state.gameOver && state.currentBet > 0 && !state.awaitingEqualChoice
    },

    activePlayerName: (state) => {
      if (state.players.length > state.currentPlayerIndex) {
        return state.players[state.currentPlayerIndex].name
      }
      return 'Player'
    },

    // Add getter for communal pot
    getCommunalPot: (state) => {
      return state.communalPot
    },
  },

  actions: {
    // Helper function to get card ID based on rank and suit
    getCardId(suit: string, rank: string): string {
      const card = cards.find((card) => card.suit === suit && card.rank === rank)
      return card ? card.id : ''
    },

    // Helper to ensure cards have proper ID
    ensureCardHasId(card: Card | null): Card | null {
      if (!card) return null

      if (!card.id && card.suit && card.rank) {
        const id = this.getCardId(card.suit, card.rank)
        return { ...card, id } // Return a new object with the ID added
      }
      return card
    },

    initGameState() {
      const savedCard = localStorage.getItem('currentCard')
      if (savedCard) {
        this.currentCard = JSON.parse(savedCard)
      }
    },

    // Save the state to localStorage
    saveStateToLocalStorage() {
      localStorage.setItem('gameState', JSON.stringify(this.$state))
    },

    // Initialize game setup
    setupGame(players: Player[]) {
      this.players = players
      this.isMultiplayer = players.length > 1

      // Get actual player credits instead of starting everyone with 500
      const playerStore = usePlayerRegistration()
      playerStore.loadPlayersFromStorage()

      console.log('Setting up game with players:', players)

      this.playerPots = players.map((player) => {
        const registeredPlayer = playerStore.players.find((p) => p.id === player.id)
        const credits = registeredPlayer?.credits || 0
        console.log(`Player ${player.name} has ${credits} credits`)
        return credits
      })

      this.betsPlaced = new Array(players.length).fill(0)
      this.winnings = new Array(players.length).fill(0)
      this.currentPlayerIndex = 0

      // Save state immediately after setup
      this.saveStateToLocalStorage()

      this.startTurnTimer() // Start timer when setting up game
    },

    // Move to next player's turn
    nextPlayerTurn() {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length

      // Reset current player's state
      this.currentCard = null // This is crucial - reset currentCard when moving to next player
      this.currentBet = 0
      this.message = `${this.activePlayerName}'s turn. Place your bet.`

      // Reset and start timer for next player
      this.startTurnTimer()

      // Save state after changing turns
      this.saveStateToLocalStorage()
    },

    // Collect rake from all players at the start of a round
    collectRake() {
      const playerStore = usePlayerRegistration()

      // For multiplayer mode, collect rake from each registered player
      for (let i = 0; i < this.players.length; i++) {
        const player = this.players[i]
        if (!player) continue // Skip if player doesn't exist

        const playerId = player.id

        // Find the registered player with this ID
        const registeredPlayerIndex = playerStore.players.findIndex((p) => p.id === playerId)

        if (registeredPlayerIndex !== -1) {
          // Deduct rake from the player's credits
          const registeredPlayer = playerStore.players[registeredPlayerIndex]
          const playerCredits = registeredPlayer.credits || 0

          if (playerCredits >= this.rakeAmount) {
            registeredPlayer.credits = playerCredits - this.rakeAmount
            this.communalPot += this.rakeAmount
          } else {
            // If player doesn't have enough credits, take what they have
            this.communalPot += playerCredits
            registeredPlayer.credits = 0
          }

          // Update the player's pot in the game
          this.playerPots[i] = registeredPlayer.credits || 0
        } else {
          // Handle case where player isn't registered
          this.playerPots[i] = 0
        }
      }

      // Save updated player data to localStorage
      localStorage.setItem('players', JSON.stringify(playerStore.players))

      this.message = `New round started! Rake of ${this.rakeAmount} collected from players.`
      this.saveStateToLocalStorage()
    },

    // Starts or restarts the game
    startGame() {
      // Create and shuffle the deck
      localStorage.removeItem('currentCard')

      const createdDeck = createDeck()
      this.deck = shuffle(createdDeck)

      // Load players from registration store
      const playerStore = usePlayerRegistration()
      playerStore.loadPlayersFromStorage()

      // Set up players from registration
      this.playerPots = this.players.map((player) => {
        const registeredPlayer = playerStore.players.find((p) => p.id === player.id)
        return registeredPlayer?.credits || 0
      })

      // Check if deck has enough cards
      if (this.deck.length < 3) {
        console.error('Deck has insufficient cards to start the game')
        this.message = 'Error initializing deck. Please refresh.'
        return
      }

      // Draw initial cards and ensure they have IDs
      try {
        const card1 = this.deck.pop()
        const card2 = this.deck.pop()

        if (!card1 || !card2) {
          throw new Error('Failed to draw cards from deck')
        }

        const cardWithId1 = this.ensureCardHasId(card1)
        const cardWithId2 = this.ensureCardHasId(card2)

        this.faceUpCards = [cardWithId1, cardWithId2] // Set faceUpCards here
      } catch (error) {
        console.error('Error drawing initial cards:', error)
        this.message = 'Error drawing cards. Please restart.'
        return
      }

      // Initialize game state
      this.communalPot = 0 // Reset communal pot
      this.currentCard = null
      this.currentBet = 0
      this.gameOver = false
      this.equalCardsChoice = null
      this.awaitingEqualChoice = false
      this.roundsPlayed = 0
      this.gameStarted = true

      // Collect rake to start the first round
      this.collectRake()

      this.message = `Game started! ${this.activePlayerName}'s turn to place a bet.`

      // Start the turn timer for the first player
      this.startTurnTimer()

      // Save the state after the game starts
      this.saveStateToLocalStorage()
    },

    resetGame() {
      const allPlayers = usePlayerRegistration()
      const playerCount = usePlayerStore()
      allPlayers.clearPlayers()
      playerCount.clearPlayerCount()
      localStorage.removeItem('gameState')
      this.$reset()
      this.freshStart = true
    },

    // Handles when player makes a bet
    placeBet(betAmount: number) {
      const currentPot = this.playerPots[this.currentPlayerIndex] || 0

      if (betAmount > currentPot) {
        this.message = 'Bet exceeds the pot amount!'
        return
      }

      this.currentBet = betAmount
      this.betsPlaced[this.currentPlayerIndex] = betAmount
      this.message = `${this.activePlayerName} bet placed: ${betAmount}`

      // Save state after placing the bet
      this.saveStateToLocalStorage()
    },

    // Handles player's choice when face-up cards are equal
    handleEqualCardsChoice(choice: 'higher' | 'lower') {
      // Stop timer when choice is made
      this.stopTurnTimer()
      this.equalCardsChoice = choice
      this.awaitingEqualChoice = false
      this.drawThirdCard()
      // Save state after player makes a choice
      this.saveStateToLocalStorage()
    },

    // Draws third card and determines win/loss
    drawThirdCard() {
      // Stop the timer when player makes a move
      this.stopTurnTimer()

      if (this.currentBet <= 0) {
        this.message = 'Please place a bet first!'
        return
      }

      const drawnCard = this.deck.pop()
      if (!drawnCard) {
        this.message = 'No more cards in the deck!'
        this.gameOver = true
        return
      }

      // Ensure card has ID and assign it to currentCard
      const cardWithId = this.ensureCardHasId(drawnCard)
      this.currentCard = cardWithId

      // Save just the currentCard to localStorage
      localStorage.setItem('currentCard', JSON.stringify(this.currentCard))

      // Card values for comparison
      const rankOrder: Record<string, number> = {
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        '10': 10,
        jack: 11,
        queen: 12,
        king: 13,
      }

      // Extract and process card values
      const [card1, card2] = this.faceUpCards
      const r1 = card1?.rank ? rankOrder[card1.rank.toString()] || 0 : 0
      const r2 = card2?.rank ? rankOrder[card2.rank.toString()] || 0 : 0
      const r3 = this.currentCard?.rank ? rankOrder[this.currentCard.rank.toString()] || 0 : 0

      // Find min/max values
      const lower = Math.min(r1, r2)
      const higher = Math.max(r1, r2)

      // Process the results
      let winAmount = 0
      let resultMessage = ''
      const playerStore = usePlayerRegistration()

      // Handle equal cards case
      if (r1 === r2) {
        if (!this.equalCardsChoice && !this.awaitingEqualChoice) {
          this.awaitingEqualChoice = true
          this.message = 'Cards are equal! Choose to play higher or lower.'
          return
        }

        if (this.equalCardsChoice === 'higher') {
          if (r3 > r1) {
            // Win - get double the bet amount
            winAmount = this.currentBet
            this.communalPot -= this.currentBet // Deduct bet amount from communal pot
            resultMessage = `Win! ${this.currentCard?.rank} is higher than ${card1?.rank}. You win ${this.currentBet} credits!`
          } else {
            // Lose - add bet to communal pot
            winAmount = -this.currentBet
            this.communalPot += this.currentBet
            resultMessage = `Lose! ${this.currentCard?.rank} is not higher than ${card1?.rank}.`
          }
        } else if (this.equalCardsChoice === 'lower') {
          if (r3 < r1) {
            // Win - get double the bet amount
            winAmount = this.currentBet
            this.communalPot -= this.currentBet // Deduct bet amount from communal pot
            resultMessage = `Win! ${this.currentCard?.rank} is lower than ${card1?.rank}. You win ${this.currentBet} credits!`
          } else {
            // Lose - add bet to communal pot
            winAmount = -this.currentBet
            this.communalPot += this.currentBet
            resultMessage = `Lose! ${this.currentCard?.rank} is not lower than ${card1?.rank}.`
          }
        }
        this.equalCardsChoice = null
      }
      // Handle consecutive cards case
      else if (higher - lower === 1) {
        // Lose - add bet to communal pot
        winAmount = -this.currentBet
        this.communalPot += this.currentBet
        resultMessage = 'Lose! Cards are consecutive.'
      }
      // Handle standard case (cards with gap)
      else {
        if (r3 > lower && r3 < higher) {
          // Win - get double the bet amount
          winAmount = this.currentBet
          this.communalPot -= this.currentBet // Deduct bet amount from communal pot
          resultMessage = `Win! ${this.currentCard?.rank} is between ${card1?.rank} and ${card2?.rank}. You win ${this.currentBet} credits!`
        } else if (r3 === r1 || r3 === r2) {
          // Double loss - add double bet to communal pot
          winAmount = -this.currentBet * 2
          this.communalPot += this.currentBet * 2
          resultMessage = `Lose! Card matches one of the face-up cards. You lose double your bet!`
        } else {
          // Lose - add bet to communal pot
          winAmount = -this.currentBet
          this.communalPot += this.currentBet
          resultMessage = `Lose! ${this.currentCard?.rank} is not between ${card1?.rank} and ${card2?.rank}.`
        }
      }

      // Reset state
      this.awaitingEqualChoice = false

      // Update player's credits in both game store and registration store
      // Update player's pot in the game
      this.playerPots[this.currentPlayerIndex] += winAmount

      // Update registered player's credits
      const playerId = this.players[this.currentPlayerIndex]?.id
      if (playerId) {
        const playerIndex = playerStore.players.findIndex((p) => p.id === playerId)
        if (playerIndex !== -1) {
          const registeredPlayer = playerStore.players[playerIndex]
          const currentCredits = registeredPlayer.credits || 0

          registeredPlayer.credits = Math.max(0, currentCredits + winAmount)
        }
      }

      if (winAmount > 0) {
        this.winnings[this.currentPlayerIndex] += winAmount
      }

      const playerName =
        this.players[this.currentPlayerIndex]?.name || `Player ${this.currentPlayerIndex + 1}`
      this.message = `${playerName}: ${resultMessage}`

      // Save updated player data
      localStorage.setItem('players', JSON.stringify(playerStore.players))
      this.roundsPlayed++
      this.currentBet = 0

      // If a player won, start a new round after
      if (winAmount > 0 && !this.gameOver) {
        // Start a new round with a new rake collection
        setTimeout(() => {
          this.collectRake()
        }, 2000)
      }

      // Save the state before resetting for next round
      this.saveStateToLocalStorage()

      // Check if game should end
      if (this.deck.length < 3) {
        this.message += ' Not enough cards to continue. Game over.'
        this.gameOver = true
        return
      }

      // Handle next round
      this.handleNextRound()
    },

    // Handle transition to next round
    handleNextRound() {
      // Set up next player's turn after a short delay
      setTimeout(() => {
        this.nextPlayerTurn()
        // Draw new cards for the next player
        this.drawNewFaceUpCards()
      }, 2000)
    },

    // Draw new face-up cards for the next round
    drawNewFaceUpCards() {
      if (this.deck.length < 2) {
        this.message += ' Not enough cards to continue. Game over.'
        this.gameOver = true
        return
      }

      const newCard1 = this.deck.pop()
      const newCard2 = this.deck.pop()

      if (!newCard1 || !newCard2) {
        this.message += ' Error drawing cards. Game over.'
        this.gameOver = true
        return
      }

      this.faceUpCards = [this.ensureCardHasId(newCard1), this.ensureCardHasId(newCard2)]
    },

    // Handles player folding (skipping their turn)
    fold() {
      // Stop the timer when player folds
      this.stopTurnTimer()

      this.message = `${this.players[this.currentPlayerIndex].name} folded and skipped their turn.`
      // Move to the next player's turn
      setTimeout(() => {
        this.nextPlayerTurn()
        // Draw new cards for the next player
        this.drawNewFaceUpCards()
      }, 2000)

      this.roundsPlayed++ // Count fold as a completed round
      // Save state after folding
      this.saveStateToLocalStorage()
    },

    // Reset bet without drawing
    cancelBet() {
      if (this.currentBet > 0) {
        this.currentBet = 0
        this.message = 'Bet canceled.'
        this.saveStateToLocalStorage()
        // Restart timer after cancelling bet
        this.startTurnTimer()
      }
    },

    // Start the turn timer
    startTurnTimer() {
      // Clear any existing timer
      this.stopTurnTimer()

      // Set initial time
      this.turnTimeRemaining = 10
      this.turnTimerActive = true

      // Create a new interval that ticks every second
      this.turnTimerInterval = setInterval(() => {
        this.turnTimeRemaining--
        // If time runs out, auto-fold
        if (this.turnTimeRemaining <= 0) {
          this.stopTurnTimer()
          this.autoFold()
        }
      }, 1000)
    },

    // Stop the turn timer
    stopTurnTimer() {
      if (this.turnTimerInterval) {
        clearInterval(this.turnTimerInterval)
        this.turnTimerInterval = null
      }
      this.turnTimerActive = false
    },

    haltTurnTimer() {
      // Only proceed if the timer is active
      if (this.turnTimerActive) {
        // Clear the current interval
        if (this.turnTimerInterval) {
          clearInterval(this.turnTimerInterval)
          this.turnTimerInterval = null
        }
        this.turnTimerHalted = true
      }
    },

    // Resume the turn timer from where it left off
    resumeTurnTimer() {
      // Only resume if it was halted
      if (this.turnTimerHalted) {
        // Create a new interval that continues from current time
        this.turnTimerInterval = setInterval(() => {
          this.turnTimeRemaining--
          if (this.turnTimeRemaining <= 0) {
            this.stopTurnTimer()
            this.autoFold()
          }
        }, 1000)

        // Clear the halted flag
        this.turnTimerHalted = false
      }
    },

    // Auto-fold when time runs out
    autoFold() {
      if (this.gameStarted && !this.gameOver) {
        console.log('Time ran out - auto-folding')
        this.fold()
      }
    },

    // Get game statistics
    getGameStats() {
      return {
        roundsPlayed: this.roundsPlayed,
        playerStats: this.players.map((player, index) => ({
          name: player.name,
          currentPot: this.playerPots[index],
          totalWinnings: this.winnings[index],
        })),
      }
    },
  },
})
