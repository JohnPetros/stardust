import type { Difficulty } from '../types/Difficulty'

export function isDifficulty(difficulty: Difficulty): difficulty is Difficulty {
  const possibleDifficulty: Difficulty[] = ['all', 'easy', 'medium', 'hard']

  return possibleDifficulty.includes(difficulty)
}
