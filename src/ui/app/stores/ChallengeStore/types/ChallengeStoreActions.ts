import type { Challenge } from '@/@core/domain/entities'
import type { PanelsLayout } from './PanelsLayout'
import type { ChallengesCraftVisilibity } from '@/@core/domain/structs'
import type { TabHandler } from './TabHandler'

export type ChallengeStoreActions = {
  setChallenge: (challenge: Challenge) => void
  setCraftsVisibility: (craftsVislibility: ChallengesCraftVisilibity) => void
  setPanelsLayout: (panelslayout: PanelsLayout) => void
  setTabHandler: (tabHanlder: TabHandler) => void
  resetStore: () => void
}
