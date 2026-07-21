import type { Challenge } from '@stardust/core/challenging/entities'
import type { ChallengeCodeExecution } from '@stardust/core/challenging/structures'
import type { ChallengeCraftsVisibility } from '@stardust/core/challenging/structures'
import type { DockablePanelId } from './DockablePanelId'
import type { PanelsLayout } from './PanelsLayout'
import type { PanelsOffset } from './PanelsOffset'
import type { TabHandler } from './TabHandler'
import type { ChallengeContent } from './ChallengeContent'
import type { AssistantSelections } from './AssistantSelection'

export type ChallengeStoreState = {
  challenge: Challenge | null
  activeContent: ChallengeContent
  craftsVislibility: ChallengeCraftsVisibility | null
  mdx: string
  panelsLayout: PanelsLayout
  panelOrder: DockablePanelId[]
  panelsOffset: PanelsOffset
  results: boolean[]
  isCodeRunning: boolean
  latestCodeExecution: ChallengeCodeExecution | null
  acceptedCodeExecution: ChallengeCodeExecution | null
  codeExecutionErrorsCount: number
  currentCode: string
  pendingExecutionCode: string | null
  tabHandler: TabHandler | null
  isAssistantEnabled: boolean
  assistantSelections: AssistantSelections
}
