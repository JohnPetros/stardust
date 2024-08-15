import type { Challenge } from '@/@core/domain/entities'
import type { PanelsLayout } from './PanelsLayout'

export type ChallengeStoreActions = {
  setChallenge: (challenge: Challenge) => void
  setPanelsLayout: (panelslayout: PanelsLayout) => void
  resetStore: () => void
}
