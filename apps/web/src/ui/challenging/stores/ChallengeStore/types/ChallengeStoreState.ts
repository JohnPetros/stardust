import type { Challenge } from '@stardust/core/challenging/entities'
import type { ChallengeCraftsVisibility } from '@stardust/core/challenging/structs'
import type { ChallengeVote } from '@stardust/core/challenging/types'
import type { PanelsLayout } from './PanelsLayout'
import type { TabHandler } from './TabHandler'

export type ChallengeStoreState = {
  challenge: Challenge | null
  vote: ChallengeVote | null
  craftsVislibility: ChallengeCraftsVisibility
  mdx: string
  panelsLayout: PanelsLayout
  tabHandler: TabHandler | null
}
