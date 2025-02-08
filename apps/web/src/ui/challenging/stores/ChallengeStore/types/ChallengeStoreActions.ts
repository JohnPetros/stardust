import type { Challenge } from '@stardust/core/challenging/entities'
import type { PanelsLayout } from './PanelsLayout'
import type { ChallengeCraftsVisibility } from '@stardust/core/challenging/structs'
import type { TabHandler } from './TabHandler'
import type { ChallengeContent } from './ChallengeContent'

export type ChallengeStoreActions = {
  setChallenge: (challenge: Challenge | null) => void
  setActiveContent: (challengeContent: ChallengeContent) => void
  setPanelsLayout: (panelsLayout: PanelsLayout) => void
  setCraftsVisibility: (craftsVislibility: ChallengeCraftsVisibility) => void
  setTabHandler: (tabHandler: TabHandler) => void
  setResults: (results: boolean[]) => void
  setMdx: (mdx: string) => void
  resetStore: () => void
}
