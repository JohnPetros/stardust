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
