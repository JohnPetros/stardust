import type { ChallengeDifficultyLevel } from '#challenging/types'

export type StarChallengeRewardingPayloadDto = {
  origin: 'star-challenge'
  incorrectAnswersCount: number
  secondsCount: number
  challengeId: string
  challengeDifficultyLevel: ChallengeDifficultyLevel
  starId: string
}
