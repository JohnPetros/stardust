import type { Challenge } from '@/@core/domain/entities'
import type { PanelsLayout } from './PanelsLayout'
import type { ChallengesCraftVisilibity } from '@/@core/domain/structs'
import type { TabHandler } from './TabHandler'

export type ChallengeStoreState = {
  challenge: Challenge | null
  craftsVislibility: ChallengesCraftVisilibity
  panelsLayout: PanelsLayout
  tabHandler: TabHandler
}
