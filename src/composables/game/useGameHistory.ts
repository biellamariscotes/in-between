import { computed } from 'vue'
import { useGameHistoryStore } from '@/stores/game-history'
import type { GameHistoryEvent } from '@/interface/game-history'

export function useGameHistory() {
  const historyStore = useGameHistoryStore()

  // Get formatted event list for display
  const formattedEvents = computed(() => {
    return historyStore.events.map(formatEvent)
  })

  // Format individual event for display
  const formatEvent = (event: GameHistoryEvent) => {
    const time = new Date(event.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })

    // Add time to the event message
    return {
      ...event,
      formattedMessage: `[${time}] ${event.message}`,
    }
  }

  // Get events filtered by type
  const getEventsByType = (type: GameHistoryEvent['type']) => {
    return historyStore.getEventsByType(type).value.map(formatEvent)
  }

  // Get events filtered by player
  const getEventsByPlayer = (playerId: string) => {
    return historyStore.getEventsByPlayer(playerId).value.map(formatEvent)
  }

  // Get most recent events
  const getRecentEvents = (count: number = 10) => {
    return historyStore.getLatestEvents(count).value.map(formatEvent)
  }

  const getPlayerLogger = (player: { id?: string | number; name?: string }) => {
    // Ensure playerId and playerName are defined
    const playerId = player.id ? String(player.id) : 'unknown-id' // Fallback value or throw an error
    const playerName = player.name || 'unknown-name' // Fallback value or throw an error

    return {
      logBet: (amount: number) => historyStore.logBet(playerId, playerName, amount),
      logWin: (amount: number) => historyStore.logWin(playerId, playerName, amount),
      logLoss: (amount: number) => historyStore.logLoss(playerId, playerName, amount),
      logFold: () => historyStore.logFold(playerId, playerName),
    }
  }

  // Log events using friendly methods (without card parameters)
  const logBet = historyStore.logBet
  const logWin = historyStore.logWin
  const logLoss = historyStore.logLoss
  const logFold = historyStore.logFold
  const logRake = historyStore.logRake
  const logSystemEvent = historyStore.logSystemEvent
  const clearHistory = historyStore.clearHistory

  return {
    allEvents: computed(() => historyStore.events),
    formattedEvents,
    getEventsByType,
    getEventsByPlayer,
    getRecentEvents,
    logBet,
    logWin,
    logLoss,
    logFold,
    logRake,
    logSystemEvent,
    clearHistory,
    getPlayerLogger,
  }
}
