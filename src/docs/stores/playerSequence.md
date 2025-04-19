# `usePlayerOrderStore`

Manages player turn order with randomization, turn progression, and localStorage persistence.

### STATE

| **Name**           | **Type**            | **Description**                       |
| ------------------ | ------------------- | ------------------------------------- |
| `orderedPlayerIds` | `(string number)[]` | IDs of players in randomized order    |
| `isOrdered`        | `boolean`           | True if players have been randomized  |
| `currentTurnIndex` | `number`            | Index of the player currently on turn |

### GETTERS

| **Name**         | **Returns**           | **Description**                    |
| ---------------- | --------------------- | ---------------------------------- |
| `orderedPlayers` | `Player[]`            | Players sorted by randomized order |
| `currentPlayer`  | `Player or undefined` | Player whose turn it currently is  |

### ACTIONS

| **Name**           | **Description**                                                 |
| ------------------ | --------------------------------------------------------------- |
| `randomizeOrder()` | Shuffles players, assigns turn, sets `randomizedPosition`       |
| `resetOrder()`     | Resets player order, `randomizedPosition`, and turn state       |
| `nextTurn()`       | Advances to the next player in sequence, updates `isTurn` flags |
| `loadSavedOrder()` | Loads saved order, index, and flags from localStorage           |

### PRIVATE HELPERS

| **Name**                 | **Description**                                                 |
| ------------------------ | --------------------------------------------------------------- |
| `_setPlayerTurn(id, on)` | Sets `isTurn` for a player (internal use)                       |
| `_resetAllPlayerTurns()` | Resets `isTurn` for all players                                 |
| `_saveToLocalStorage()`  | Persists current order, turn index, and players to localStorage |
