import type { Challenge } from '@stardust/core/challenging/entities'
import type { PanelsLayout } from './PanelsLayout'
import type { ChallengeCraftsVisibility } from '@stardust/core/challenging/structs'
import type { TabHandler } from './TabHandler'
import type { ChallengeVote } from '@stardust/core/challenging/types'

export type ChallengeStoreActions = {
  setChallenge: (challenge: Challenge) => void
  setPanelsLayout: (panelsLayout: PanelsLayout) => void
  setCraftsVisibility: (craftsVislibility: ChallengeCraftsVisibility) => void
  setVote: (vote: ChallengeVote) => void
  setTabHandler: (tabHandler: TabHandler) => void
  setMdx: (mdx: string) => void
  resetStore: () => void
}
