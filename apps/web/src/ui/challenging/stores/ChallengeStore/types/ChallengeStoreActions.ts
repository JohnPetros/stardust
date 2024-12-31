import type { Challenge } from '@stardust/core/challenging/entities'
import type { PanelsLayout } from './PanelsLayout'
import type { ChallengeCraftsVisibility } from '@stardust/core/challenging/structs'
import type { TabHandler } from './TabHandler'

export type ChallengeStoreActions = {
  setChallenge: (challenge: Challenge | null) => void
  setPanelsLayout: (panelsLayout: PanelsLayout) => void
  setCraftsVisibility: (craftsVislibility: ChallengeCraftsVisibility) => void
  setTabHandler: (tabHandler: TabHandler) => void
  setMdx: (mdx: string) => void
  resetStore: () => void
}
