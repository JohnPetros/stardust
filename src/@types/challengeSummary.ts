import type { Challenge } from './Challenge'

export type ChallengeSummary = Pick<
  Challenge,
  'id' | 'difficulty' | 'isCompleted'
>
