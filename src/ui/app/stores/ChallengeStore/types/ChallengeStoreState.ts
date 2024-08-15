import type { Challenge } from '@/@core/domain/entities'
import type { PanelsLayout } from './PanelsLayout'

export type ChallengeStoreState = {
  challenge: Challenge | null
  panelsLayout: PanelsLayout
}
