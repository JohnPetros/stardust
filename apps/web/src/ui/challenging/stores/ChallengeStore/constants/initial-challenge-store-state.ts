import type { ChallengeStoreState } from '../types'
import {
  DEFAULT_PANEL_ORDER,
  DEFAULT_PANELS_OFFSET,
} from '../../../widgets/layouts/Challenge/constants/panel-layout'

export const INITIAL_CHALLENGE_STORE_STATE: ChallengeStoreState = {
  challenge: null,
  activeContent: 'description',
  craftsVislibility: null,
  mdx: '',
  results: [],
  isCodeRunning: false,
  latestCodeExecution: null,
  acceptedCodeExecution: null,
  codeExecutionErrorsCount: 0,
  currentCode: '',
  pendingExecutionCode: null,
  tabHandler: null,
  isAssistantEnabled: false,
  panelsLayout: 'tabs-left;code_editor-right',
  panelOrder: DEFAULT_PANEL_ORDER,
  panelsOffset: DEFAULT_PANELS_OFFSET,
  assistantSelections: {
    textSelection: null,
    codeSelection: null,
  },
}
