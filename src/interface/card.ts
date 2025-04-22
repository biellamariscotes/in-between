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
  hasFolded: boolean // ✅ Must be included here
}
