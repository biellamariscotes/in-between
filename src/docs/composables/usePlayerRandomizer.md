# `usePlayerRandomizer`

### FUNCTIONS

| **Name**                | **Returns**            | **Description**                                      |
|-------------------------|------------------------|------------------------------------------------------|
| `randomizePlayers()`     | `Player[]`             | Randomizes the player order and initializes turn state. |
| `getCurrentPlayer(turn: number)` | `Player OR undefined` | Retrieves the player for the current turn number.       |
| `getNextPlayer(currentPlayerId: string OR number)` | `Player OR undefined` | Gets the next player after the current one in turn sequence. |
| `resetPlayerOrder()`     | `void`                 | Resets all player order and turn data.                 |
| `arePlayersOrdered()`    | `boolean`              | Returns whether the players have been randomized already. |

### VALUES

| **Name**            | **Type**       | **Description**                                       |
|---------------------|----------------|-------------------------------------------------------|
| `orderedPlayers`    | `Player[]`     | Reactive array of players in their randomized order.  |
