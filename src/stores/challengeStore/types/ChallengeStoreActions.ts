import type { PanelsLayout } from './PanelsLayout'
import type { TabHandler } from './TabHandler'

import type { Challenge } from '@/@types/Challenge'
import type { Vote } from '@/@types/Vote'

export type ChallengeStoreActions = {
  setChallenge: (challenge: Challenge) => void
  setUserOutput: (challenge: string[]) => void
  setResults: (results: boolean[]) => void
  setMdx: (mdx: string) => void
  setUserVote: (useVote: Vote) => void
  setIsEnd: (isEnd: boolean) => void
  setTabHandler: (tabHandler: TabHandler) => void
  setPanelsLayout: (panelslayout: PanelsLayout) => void
  setCanShowComments: (canShowComments: boolean) => void
  setCanShowSolutions: (canShowSolutions: boolean) => void
  incrementIncorrectAswersAmount: () => void
  resetState: () => void
}
