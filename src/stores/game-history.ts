import { defineStore } from 'pinia'
import type { GameHistoryEvent, GameHistoryState } from '@/interface/game-history'

export const useGameHistoryStore = defineStore('gameHistory', {
  state: () => {
    // Initialize state
    const events: GameHistoryEvent[] = []
    let maxEvents = 100
    // Try to load saved history
    try {
      const savedHistory = localStorage.getItem('gameHistory')
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory) as GameHistoryState
        if (parsedHistory.events) events.push(...parsedHistory.events)
        if (parsedHistory.maxEvents) maxEvents = parsedHistory.maxEvents
      }
    } catch (e) {
      console.error('Failed to parse saved game history:', e)
    }

    console.log('Initializing new game history state')

    return {
      events,
      maxEvents,
    }
  },

  getters: {
    getEventsByType: (state) => {
      return (type: GameHistoryEvent['type']) => {
        return state.events.filter((event) => event.type === type)
      }
    },

    getEventsByPlayer: (state) => {
      return (playerId: string) => {
        return state.events.filter((event) => event.playerId === playerId)
      }
    },

    getLatestEvents: (state) => {
      return (count: number = 10) => {
        return state.events.slice(-count)
      }
    },
  },

  actions: {
    saveToLocalStorage() {
      console.log('Saving game history to localStorage')
      localStorage.setItem(
        'gameHistory',
        JSON.stringify({ events: this.events, maxEvents: this.maxEvents }),
      )
    },

    addEvent(event: Omit<GameHistoryEvent, 'id' | 'timestamp'>) {
      const newEvent: GameHistoryEvent = {
        ...event,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      }

      console.log('Adding new event:', newEvent)
      this.events.push(newEvent)

      // Trim events if we exceed max
      if (this.events.length > this.maxEvents) {
        console.log('Trimming events to max limit:', this.maxEvents)
        this.events = this.events.slice(-this.maxEvents)
      }

      this.saveToLocalStorage()
    },

    logBet(playerId: string, playerName: string, amount: number) {
      this.addEvent({
        playerId,
        playerName,
        type: 'bet',
        message: `${playerName} placed a bet of ${amount} credits.`,
        amount,
      })
    },

    logWin(playerId: string, playerName: string, amount: number) {
      this.addEvent({
        playerId,
        playerName,
        type: 'win',
        message: `${playerName} won ${amount} credits!`,
        amount,
      })
    },

    logLoss(playerId: string, playerName: string, amount: number) {
      this.addEvent({
        playerId,
        playerName,
        type: 'loss',
        message: `${playerName} lost ${amount} credits.`,
        amount,
      })
    },

    logFold(playerId: string, playerName: string) {
      this.addEvent({
        playerId,
        playerName,
        type: 'fold',
        message: `${playerName} folded.`,
      })
    },

    logRake(amount: number) {
      this.addEvent({
        playerId: 'system',
        playerName: 'System',
        type: 'rake',
        message: `Rake of ${amount} credits collected.`,
        amount,
      })
    },

    logSystemEvent(message: string) {
      this.addEvent({
        playerId: 'system',
        playerName: 'System',
        type: 'system',
        message,
      })
    },

    clearHistory() {
      this.events = []
      this.saveToLocalStorage()
    },
  },
})
