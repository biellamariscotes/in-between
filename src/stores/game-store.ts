/**
 * PARTIAL GAME CONCEPT
 *
 *
 * In-Between Card Game Store
 *
 * How to Play:
 * 1. Game starts with 500 points in your pot
 * 2. Two cards are shown face up
 * 3. Place your bet (can't bet more than what's in your pot)
 * 4. Draw a third card
 *
 * Winning:
 * - If the third card is between the two face-up cards = Win your bet amount
 * - If the two face-up cards are equal:
 *   * You can choose if the next card will be higher or lower
 *   * Guess correctly = Win double your bet
 *
 * Losing:
 * - If the third card matches either face-up card = Lose double your bet
 * - If the face-up cards are next to each other (like 7,8) = Lose your bet
 * - If the third card is not between = Lose your bet
 *
 * Game Ends:
 * - When there aren't enough cards left to play (needs 3 cards per round)
 * - You can always restart the game
 */

import { defineStore } from 'pinia'
import { createDeck } from '@/utils/createDeck'
import { shuffle } from '@/utils/shuffleDeck'
import { cards } from '@/utils/data/cards'
import type { Card, GameState } from '@/interface/card'

export const useGameStore = defineStore('game', {
  state: (): GameState => {
    // Try to load from localStorage
    const savedState = localStorage.getItem('gameState')
    if (savedState) {
      return JSON.parse(savedState) as GameState
    }

    return {
      deck: [] as Card[],
      faceUpCards: [null, null] as (Card | null)[],
      currentCard: null as Card | null,
      pot: 500,
      currentBet: 0,
      message: '',
      gameOver: false,
      equalCardsChoice: null,
      awaitingEqualChoice: false,
      hasFolded: false,
    }
  },

  actions: {
    // Helper function to get card ID based on rank and suit
    getCardId(suit: string, rank: string): string {
      const card = cards.find((card) => card.suit === suit && card.rank === rank)
      return card ? card.id : ''
    },

    // Helper to ensure cards have proper ID
    ensureCardHasId(card: any) {
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

    // Starts or restarts the game
    startGame() {
      // Create and shuffle the deck
      localStorage.removeItem('currentCard')

      const createdDeck = createDeck()

      this.deck = shuffle(createdDeck)

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

        console.log('Drawn Cards:', card1, card2) // Debug log

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
      this.currentCard = null
      this.pot = 500
      this.currentBet = 0
      this.message = 'Game started! Place your bet.'
      this.gameOver = false
      this.equalCardsChoice = null
      this.awaitingEqualChoice = false

      // Save the state after the game starts
      this.saveStateToLocalStorage()
    },

    // Handles when player makes a bet
    placeBet(betAmount: number) {
      if (this.hasFolded) {
        this.message = 'You folded! Wait for the next round.'
        return
      }
      if (betAmount > this.pot) {
        this.message = 'Bet exceeds the pot amount!'
        return
      }
      this.currentBet = betAmount
      this.message = `Bet placed: ${betAmount}`
      this.saveStateToLocalStorage()
    },

    // Handles player's choice when face-up cards are equal
    handleEqualCardsChoice(choice: 'higher' | 'lower') {
      this.equalCardsChoice = choice
      this.awaitingEqualChoice = false
      this.drawThirdCard()

      // Save state after player makes a choice
      this.saveStateToLocalStorage()
    },

    // Draws third card and determines win/loss
    drawThirdCard() {
      // if (this.currentBet <= 0) {
      //   this.message = 'Please place a bet first!'
      //   return
      // }
      if (this.hasFolded) {
        this.message = 'you folded this round! Wait for the next one.'
        return
      }
      window.location.reload()

      const drawnCard = this.deck.pop()

      // Ensure card has ID and assign it to currentCard
      const cardWithId = this.ensureCardHasId(drawnCard)

      // Set current card
      this.currentCard = { ...cardWithId }

      // Save just the currentCard to localStorage
      localStorage.setItem('currentCard', JSON.stringify(this.currentCard))

      // Card values for comparison (1=Ace through 13=King)
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

      // Convert cards to number values for easier comparison
      const card1 = this.faceUpCards[0]
      const card2 = this.faceUpCards[1]
      const r1 = card1?.rank ? rankOrder[card1.rank] : 0
      const r2 = card2?.rank ? rankOrder[card2.rank] : 0
      const r3 = this.currentCard?.rank ? rankOrder[this.currentCard.rank] : 0

      // Find which face-up card is higher/lower
      const lower = Math.min(r1, r2)
      const higher = Math.max(r1, r2)

      // If face-up cards are equal
      if (r1 === r2) {
        // If we're waiting for player's choice
        if (!this.equalCardsChoice && !this.awaitingEqualChoice) {
          this.awaitingEqualChoice = true
          this.message = 'Cards are equal! Choose to play higher or lower.'
          return
        }

        // Process the player's choice
        if (this.equalCardsChoice === 'higher') {
          if (r3 > r1) {
            this.pot -= this.currentBet * 2 // Double win for correct higher/lower
            this.message = `Win! ${this.currentCard?.rank} is higher than ${card1?.rank}.`
          } else {
            this.pot += this.currentBet
            this.message = `Lose! ${this.currentCard?.rank} is not higher than ${card1?.rank}.`
          }
        } else if (this.equalCardsChoice === 'lower') {
          if (r3 < r1) {
            this.pot -= this.currentBet * 2 // Double win for correct higher/lower
            this.message = `Win! ${this.currentCard?.rank} is lower than ${card1?.rank}.`
          } else {
            this.pot += this.currentBet
            this.message = `Lose! ${this.currentCard?.rank} is not lower than ${card1?.rank}.`
          }
          if (this.hasFolded) {
            this.message = 'You folded this round! Wait for the next one.'
            return
          }
        }

        // Reset the choice for next round
        this.equalCardsChoice = null
      }

      // If face-up cards are consecutive numbers
      else if (higher - lower === 1) {
        this.pot += this.currentBet
        this.message = 'Cards are consecutive. You lose your bet.'
      }

      // Otherwise, check if third card is between
      else {
        if (r3 > lower && r3 < higher) {
          this.pot -= this.currentBet
          this.message = `Win! ${this.currentCard?.rank} is between ${card1?.rank} and ${card2?.rank}.`
        } else if (r3 === r1 || r3 === r2) {
          // If it exactly matches (a "post") lose double bet.
          this.pot += this.currentBet * 2
          this.message = 'Card matches one of the face-up cards. You lose double your bet!'
        } else {
          this.pot += this.currentBet
          this.message = `Lose. ${this.currentCard?.rank} is not between ${card1?.rank} and ${card2?.rank}.`
        }

        // Reset awaiting choice state when starting new round
        this.awaitingEqualChoice = false
      }

      // Save the state before resetting for next round
      this.saveStateToLocalStorage()

      // Prepare for next round or end game if deck is low
      if (this.deck.length < 3) {
        this.message += ' Not enough cards to continue. Game over.'
        this.gameOver = true
      } else {
        // Start a new round if game is still active.
        if (!this.gameOver) {
          const newCard1 = this.deck.pop()!
          const newCard2 = this.deck.pop()!
          this.faceUpCards = [this.ensureCardHasId(newCard1), this.ensureCardHasId(newCard2)]
          this.currentBet = 0
        }
      }
    },

    fold() {
      this.hasFolded = true
      this.message = 'Player has folded! Starting a new round...'
      setTimeout(() => {
        this.resetRound()
        this.startGame()
      }, 900)
    },
    resetRound() {
      this.hasFolded = false
      this.currentBet = 0
      this.currentCard = null
      this.faceUpCards = [null, null]
      this.message = 'New round started! Place your bet.'
    },
  },
})
