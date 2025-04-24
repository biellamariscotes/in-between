# `gameStore`

## Usage

```typescript
// Import the store
import { useGameStore } from '@/stores/game'

// In a component setup
const gameStore = useGameStore()

// Start a new game
gameStore.startGame()

// Place a bet
gameStore.placeBet(10)

// Draw a card
gameStore.drawThirdCard()

// Check if game is over
if (gameStore.gameOver) {
  console.log('Game over!')
}
```

### STATE
| State Property          | Type                                | Description                                                    |
|:-----------------------|:------------------------------------|:---------------------------------------------------------------|
| `freshStart`            | `boolean`                            | Indicates if it's a fresh game start                            |
| `deck`                  | `Card[]`                             | Deck of cards                                                   |
| `faceUpCards`           | `[Card \| null, Card \| null]`       | Two cards currently face-up                                     |
| `currentCard`           | `Card \| null`                       | The third card drawn during a turn                              |
| `currentBet`            | `number`                             | Current player's bet amount                                     |
| `message`               | `string`                             | Message for game events                                         |
| `pot`                   | `number`                             | Total pot for the current round                                  |
| `gameOver`              | `boolean`                            | Whether the game has ended                                       |
| `equalCardsChoice`      | `'higher' \| 'lower' \| null`        | Player's choice when face-up cards are equal                     |
| `awaitingEqualChoice`   | `boolean`                            | If game is awaiting equal cards decision                         |
| `players`               | `Player[]`                           | List of players                                                  |
| `currentPlayerIndex`    | `number`                             | Index of current player                                          |
| `roundsPlayed`          | `number`                             | Number of rounds played                                          |
| `winnings`              | `number[]`                           | Array of winnings for each player                                |
| `playerPots`            | `number[]`                           | Array of individual player pots                                  |
| `betsPlaced`            | `number[]`                           | Array tracking placed bets                                       |
| `gameStarted`           | `boolean`                            | Indicates if game has started                                    |
| `communalPot`           | `number`                             | Communal pot shared among players                                |
| `rakeAmount`            | `number`                             | Rake amount collected per round                                  |
| `turnTimeRemaining`     | `number`                             | Time remaining for current player's turn                         |
| `turnTimerActive`       | `boolean`                            | If turn timer is currently running                               |
| `turnTimerInterval`     | `number \| null`                     | Interval ID for the turn timer                                    |
| `turnTimerHalted`       | `boolean`                            | Whether the turn timer is temporarily halted                     |
| `isMultiplayer`         | `boolean`                            | Indicates if the game is multiplayer                             |


### GETTERS
| Getter               | Description                                      |
|:--------------------|:-------------------------------------------------|
| `getTotalPot`        | Returns sum of all player pots                    |
| `getCurrentPlayerPot`| Returns current player's pot amount               |
| `canPlaceBet`        | Checks if the current player can place a bet      |
| `canDrawCard`        | Checks if the current player can draw a card      |
| `activePlayerName`   | Returns the active player's name                  |
| `getCommunalPot`     | Returns the amount in the communal pot            |

### GAME SETUP

| Action            | Description                                |
|:-----------------|:-------------------------------------------|
| `initGameState`   | Initializes game state from local storage   |
| `setupGame`       | Sets up a game with provided players        |
| `startGame`       | Initializes a new game                      |
| `resetGame`       | Resets the game state                       |

### PLAYER TURN MANAGEMENT
| Action                   | Description                                                   |
|:------------------------|:--------------------------------------------------------------|
| `nextPlayerTurn`         | Advances to the next player's turn                            |
| `placeBet`               | Places a bet for the current player                           |
| `cancelBet`              | Cancels the current bet                                        |
| `fold`                   | Current player folds their turn                               |
| `autoFold`               | Automatically folds when timer runs out                       |
| `handleEqualCardsChoice` | Handles player choice when face-up cards are equal             |

### CARD OPERATIONS
| Action                    | Description                                                      |
|:--------------------------|:-----------------------------------------------------------------|
| `drawNewFaceUpCards`       | Draws two new face-up cards                                       |
| `drawThirdCard`            | Draws the third card to determine win/loss                       |
| `processGameResult`        | Evaluates the outcome of the current play                        |
| `processEqualCardsResult`  | Processes result when cards are equal                            |
| `getEqualCardsMessage`     | Generates message for equal cards scenario                       |
| `updatePlayerCredits`      | Updates player credits after a round                             |
| `handleNextRound`          | Prepares the game for the next round                              |

### MONETARY FUNCTIONS
| Action          | Description                                |
|:----------------|:-------------------------------------------|
| `collectRake`    | Collects rake from players at the start of a round |

### TIMER FUNCTIONS
| Action              | Description                          |
|:-------------------|:-------------------------------------|
| `startTurnTimer`    | Starts the turn timer                 |
| `stopTurnTimer`     | Stops the turn timer                  |
| `haltTurnTimer`     | Temporarily pauses the turn timer     |
| `resumeTurnTimer`   | Resumes a paused turn timer           |

### Utility
| Function                  | Description                                                |
|:-------------------------|:-----------------------------------------------------------|
| `getGameStats`            | Returns game statistics                                    |
| `getCardId`               | Gets a card ID from suit and rank                          |
| `ensureCardHasId`         | Ensures a card has an `id` property                         |
| `saveStateToLocalStorage` | Persists game state to local storage                        |

## Persistence
The game state is automatically saved to local storage.

## Dependencies
- Pinia: state management
- Card utilities: deck creation and shuffling
- Player registration store (`player.ts`):  for managing player data