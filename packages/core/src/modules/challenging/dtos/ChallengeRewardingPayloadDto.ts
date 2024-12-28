import type { ChallengeDifficultyLevel } from '#challenging/types'

export type ChallengeRewardingPayloadDto = {
  origin: 'challenge'
  incorrectAnswersCount: number
  secondsCount: number
  challengeId: string
  challengeDifficultyLevel: ChallengeDifficultyLevel
}
