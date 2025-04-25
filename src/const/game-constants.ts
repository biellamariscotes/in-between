/**
 * Game configuration constants
 * Contains all constant values used throughout the card game.
 */

/** Number of seconds for initial player turn */
export const INITIAL_TURN_TIME = 10

/** Default rake amount (in chips) taken from each pot */
export const RAKE_AMOUNT = 100

/** Animation transition delay in milliseconds */
export const TRANSITION_DELAY = 2000

/**
 * Card rank values for comparison operations
 * Maps string representation of ranks to their numerical values
 * @type {Record<string, number>}
 */
export const RANK_ORDER: Record<string, number> = {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  jack: 11,
  queen: 12,
  king: 13,
}
