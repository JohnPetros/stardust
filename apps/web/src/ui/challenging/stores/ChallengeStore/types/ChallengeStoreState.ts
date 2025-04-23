import type { Challenge, Solution } from '@stardust/core/challenging/entities'
import type { ChallengeCraftsVisibility } from '@stardust/core/challenging/structures'
import type { PanelsLayout } from './PanelsLayout'
import type { TabHandler } from './TabHandler'
import type { ChallengeContent } from './ChallengeContent'

export type ChallengeStoreState = {
  challenge: Challenge | null
  activeContent: ChallengeContent
  craftsVislibility: ChallengeCraftsVisibility | null
  mdx: string
  panelsLayout: PanelsLayout
  results: boolean[]
  tabHandler: TabHandler | null
}
