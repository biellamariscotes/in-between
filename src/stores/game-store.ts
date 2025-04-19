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
import type { GameState } from '@/interface/card'

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    deck: [],
    faceUpCards: [],
    currentCard: null,
    pot: 500,
    currentBet: 0,
    message: '',
    gameOver: false,
    equalCardsChoice: null,
    awaitingEqualChoice: false,
  }),

  actions: {
    // Starts or restarts the game
    startGame() {
      this.deck = shuffle(createDeck())
      this.faceUpCards = [this.deck.pop()!, this.deck.pop()!]
      this.currentCard = null
      this.pot = 500
      this.currentBet = 0
      this.message = ''
      this.gameOver = false
      this.equalCardsChoice = null
      this.awaitingEqualChoice = false
    },

    // Handles when player makes a bet
    placeBet(betAmount: number) {
      if (betAmount > this.pot) {
        this.message = 'Bet exceeds the pot amount!'
        return
      }

      this.currentBet = betAmount
      this.message = `Bet placed: ${betAmount}`
    },

    // Handles player's choice when face-up cards are equal
    handleEqualCardsChoice(choice: 'higher' | 'lower') {
      this.equalCardsChoice = choice
      this.awaitingEqualChoice = false
      this.drawThirdCard()
    },

    // Draws third card and determines win/loss
    drawThirdCard() {
      // Check if player made a bet
      if (this.currentBet <= 0) {
        this.message = 'Please place a bet first!'
        return
      }

      // Get the third card
      this.currentCard = this.deck.pop()!

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
      const r1 = card1.rank ? rankOrder[card1.rank] : 0
      const r2 = card2.rank ? rankOrder[card2.rank] : 0
      const r3 = this.currentCard.rank ? rankOrder[this.currentCard.rank] : 0

      // Find which face-up card is higher/lower
      const lower = Math.min(r1, r2)
      const higher = Math.max(r1, r2)

      // If face-up cards are equal
      if (r1 === r2) {
        // If we're waiting for player's choice
        if (!this.equalCardsChoice && !this.awaitingEqualChoice) {
          this.awaitingEqualChoice = true
          this.message = 'Cards are equal! Choose to play higher or lower.'
          this.currentCard = null // Hide the drawn card until choice is made
          return
        }

        // Process the player's choice
        if (this.equalCardsChoice === 'higher') {
          if (r3 > r1) {
            this.pot -= this.currentBet * 2 // Double win for correct higher/lower
            this.message = `Win! ${this.currentCard.rank} is higher than ${card1.rank}.`
          } else {
            this.pot += this.currentBet
            this.message = `Lose! ${this.currentCard.rank} is not higher than ${card1.rank}.`
          }
        } else if (this.equalCardsChoice === 'lower') {
          if (r3 < r1) {
            this.pot -= this.currentBet * 2 // Double win for correct higher/lower
            this.message = `Win! ${this.currentCard.rank} is lower than ${card1.rank}.`
          } else {
            this.pot += this.currentBet
            this.message = `Lose! ${this.currentCard.rank} is not lower than ${card1.rank}.`
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
          this.message = `Win! ${this.currentCard.rank} is between ${card1.rank} and ${card2.rank}.`
        } else if (r3 === r1 || r3 === r2) {
          // If it exactly matches (a "post") lose double bet.
          this.pot += this.currentBet * 2
          this.message = 'Card matches one of the face up cards. You lose double your bet!'
        } else {
          this.pot += this.currentBet
          this.message = `Lose. ${this.currentCard.rank} is not between ${card1.rank} and ${card2.rank}.`
        }

        // Reset awaiting choice state when starting new round
        this.awaitingEqualChoice = false
      }

      // Prepare for next round or end game if deck is low
      if (this.deck.length < 3) {
        this.message += ' Not enough cards to continue. Game over.'
        this.gameOver = true
      } else {
        // Start a new round if game is still active.
        if (!this.gameOver) {
          this.faceUpCards = [this.deck.pop()!, this.deck.pop()!]
          this.currentCard = null
          this.currentBet = 0
        }
      }
    },
  },
})
