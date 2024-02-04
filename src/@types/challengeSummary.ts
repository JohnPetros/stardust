import type { Challenge } from './challenge'

export type ChallengeSummary = Pick<
  Challenge,
  'id' | 'difficulty' | 'isCompleted'
> & {
  userCompletedChallengesIds: []
}
