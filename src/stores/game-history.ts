import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameHistoryEvent, GameHistoryState } from '@/interface/game-history'

export const useGameHistoryStore = defineStore('gameHistory', () => {
  // Reactive state
  const events = ref<GameHistoryEvent[]>([])
  const maxEvents = ref<number>(100)

  // Try to load saved history
  try {
    const savedHistory = localStorage.getItem('gameHistory')
    if (savedHistory) {
      console.log('Loaded saved game history:', savedHistory)
      const parsedHistory = JSON.parse(savedHistory) as GameHistoryState
      events.value = parsedHistory.events
      maxEvents.value = parsedHistory.maxEvents
    }
  } catch (e) {
    console.error('Failed to parse saved game history:', e)
  }

  console.log('Initializing new game history state')

  // Computed properties
  const getEventsByType = (type: GameHistoryEvent['type']) => {
    console.log(`Getting events of type: ${type}`)
    return computed(() => events.value.filter((event) => event.type === type))
  }

  const getEventsByPlayer = (playerId: string) => {
    console.log(`Getting events for player ID: ${playerId}`)
    return computed(() => events.value.filter((event) => event.playerId === playerId))
  }

  const getLatestEvents = (count: number = 10) => {
    console.log(`Getting latest ${count} events`)
    return computed(() => events.value.slice(-count))
  }

  // Actions
  const addEvent = (event: Omit<GameHistoryEvent, 'id' | 'timestamp'>) => {
    const newEvent: GameHistoryEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    }

    console.log('Adding new event:', newEvent)
    events.value.push(newEvent)

    // Trim events if we exceed max
    if (events.value.length > maxEvents.value) {
      console.log('Trimming events to max limit:', maxEvents.value)
      events.value = events.value.slice(-maxEvents.value)
    }

    saveToLocalStorage()
  }

  const logBet = (playerId: string, playerName: string, amount: number) => {
    console.log(`✂️ Logging bet: ${playerName} bet ${amount} credits`)
    addEvent({
      playerId,
      playerName,
      type: 'bet',
      message: `${playerName} placed a bet of ${amount} credits.`,
      amount,
    })
  }

  const logWin = (playerId: string, playerName: string, amount: number) => {
    console.log(`Logging win: ${playerName} won ${amount} credits`)
    addEvent({
      playerId,
      playerName,
      type: 'win',
      message: `${playerName} won ${amount} credits!`,
      amount,
    })
  }

  const logLoss = (playerId: string, playerName: string, amount: number) => {
    console.log(`Logging loss: ${playerName} lost ${amount} credits`)
    addEvent({
      playerId,
      playerName,
      type: 'loss',
      message: `${playerName} lost ${amount} credits.`,
      amount,
    })
  }

  const logFold = (playerId: string, playerName: string) => {
    console.log(`Logging fold: ${playerName} folded`)
    addEvent({
      playerId,
      playerName,
      type: 'fold',
      message: `${playerName} folded.`,
    })
  }

  const logRake = (amount: number) => {
    console.log(`Logging rake: ${amount} credits collected`)
    addEvent({
      playerId: 'system',
      playerName: 'System',
      type: 'rake',
      message: `Rake of ${amount} credits collected.`,
      amount,
    })
  }

  const logSystemEvent = (message: string) => {
    console.log(`Logging system event: ${message}`)
    addEvent({
      playerId: 'system',
      playerName: 'System',
      type: 'system',
      message,
    })
  }

  const clearHistory = () => {
    console.log('Clearing game history')
    events.value = []
    saveToLocalStorage()
  }

  const saveToLocalStorage = () => {
    console.log('Saving game history to localStorage')
    localStorage.setItem(
      'gameHistory',
      JSON.stringify({ events: events.value, maxEvents: maxEvents.value }),
    )
  }

  return {
    events,
    maxEvents,
    getEventsByType,
    getEventsByPlayer,
    getLatestEvents,
    logBet,
    logWin,
    logLoss,
    logFold,
    logRake,
    logSystemEvent,
    clearHistory,
  }
})
