import type { ChallengeDifficulty } from './Challenge'

export type RewardsOrigin = 'star' | 'star-challenge' | 'challenge'

export type StarPayload = {
  incorrectAnswers: number
  questions: number
  starId: string
  seconds: number
}

export type StarChallengePayload = {
  incorrectAnswers: number
  difficulty: ChallengeDifficulty
  isCompleted: boolean
  challengeId: string
  starId: string
  seconds: number
}

export type ChallengePayload = Omit<StarChallengePayload, 'starId'>

export type StarRewardsPayload = {
  star: StarPayload
}

export type StarChallengeRewardsPayload = {
  'star-challenge': StarChallengePayload
}

export type ChallengeRewardsPayload = {
  challenge: ChallengePayload
}
