import type { Card } from '@/interface/card'

/**
 * Convert a card object to a string ID format
 */
export function cardToId(card: Card): string {
  const suitMap = {
    hearts: 'h',
    diamonds: 'd',
    clubs: 'c',
    spades: 's',
  } as const
  const suit = suitMap[card.suit as keyof typeof suitMap] ?? 'x'
  const rank = typeof card.rank === 'string' ? card.rank : String(card.rank)
  return suit + rank
}

/**
 * Convert card from game store to display format
 */
export function cardToDisplayId(card: Card | null): string {
  if (!card) return ''

  // If card already has an id property, use it
  if (card.id) return card.id

  // Otherwise construct from suit and rank
  return cardToId(card)
}
