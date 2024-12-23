import type { Challenge } from '@stardust/core/challenging/entities'
import type { PanelsLayout } from './PanelsLayout'
import type { ChallengeCraftsVisibility } from '@stardust/core/challenging/structs'

export type ChallengeStoreActions = {
  setChallenge: (challenge: Challenge) => void
  setPanelsLayout: (panelsLayout: PanelsLayout) => void
  setCraftsVisibility: (craftsVislibility: ChallengeCraftsVisibility) => void
  setTabHandler: (tabHandler: TabHandler) => void
  resetState: () => void
}
