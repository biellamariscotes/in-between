export interface Player {
  id?: string | number
  name?: string
  credits?: number | null
  randomizedPosition?: number
  isTurn?: boolean
  isTurnComplete?: boolean
}
