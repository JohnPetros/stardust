import type { Challenge, Solution } from '@stardust/core/challenging/entities'
import type { ChallengeCraftsVisibility } from '@stardust/core/challenging/structs'
import type { PanelsLayout } from './PanelsLayout'
import type { TabHandler } from './TabHandler'
import type { ChallengeContent } from './ChallengeContent'

export type ChallengeStoreState = {
  challenge: Challenge | null
  solutionContent: string
  activeContent: ChallengeContent
  craftsVislibility: ChallengeCraftsVisibility
  mdx: string
  panelsLayout: PanelsLayout
  results: boolean[]
  tabHandler: TabHandler | null
}
