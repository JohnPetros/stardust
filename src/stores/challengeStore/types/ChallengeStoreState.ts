import type { PanelsLayout } from './PanelsLayout'
import type { TabHandler } from './TabHandler'

import type {
  Challenge,
  ChallengeTestCaseExpectedOutput,
} from '@/@types/Challenge'
import type { Vote } from '@/@types/Vote'

export type ChallengeStoreState = {
  challenge: Challenge | null
  userOutput: ChallengeTestCaseExpectedOutput[]
  results: boolean[]
  mdx: string
  isEnd: boolean
  incorrectAnswersAmount: number
  canShowComments: boolean
  canShowSolutions: boolean
  userVote: Vote
  panelsLayout: PanelsLayout
  tabHandler: TabHandler | null
}
