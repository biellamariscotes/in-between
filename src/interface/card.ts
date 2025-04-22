import type { Player } from './player'
export interface Card {
  suit?: string
  rank?: string
  id?: string
  file_name?: string
  order?: number
}

// Define the game state.
export interface GameState {
  deck: Card[] // All cards in the deck
  faceUpCards: (Card | null)[] // Update this to allow Card or null
  currentCard: Card | null
  pot: number // Player's money/points
  currentBet: number // How much player is betting
  message: string // Game messages for the player
  gameOver: boolean // Tracks if game has ended
  equalCardsChoice: 'higher' | 'lower' | null // Player's choice when cards are equal
  awaitingEqualChoice: boolean // Waiting for player to choose higher/lower

  // Multiplayer related properties
  isMultiplayer: boolean // Whether game is in multiplayer mode
  players: Player[] // Array of player objects
  currentPlayerIndex: number // Index of the current player
  roundsPlayed: number // Number of rounds played
  winnings: number[] // Array of player winnings
  playerPots: number[] // Array of player pots
  betsPlaced: number[] // Array of bets placed by players
  gameStarted: boolean // Whether the game has started

  // Timer related properties
  turnTimeRemaining: number
  turnTimerActive: boolean
  turnTimerInterval: ReturnType<typeof setTimeout> | null
}
