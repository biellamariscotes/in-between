/**
 * Represents the states of history event
 */

export interface GameHistoryEvent {
  id: string
  timestamp: number
  playerId: string
  playerName: string
  type: 'bet' | 'win' | 'loss' | 'fold' | 'rake' | 'system'
  message: string
  amount?: number
}

export interface GameHistoryState {
  events: GameHistoryEvent[]
  maxEvents: number
}
