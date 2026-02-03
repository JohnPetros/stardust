import type { ChallengeStoreState } from '../types'

export const INITIAL_CHALLENGE_STORE_STATE: ChallengeStoreState = {
  challenge: null,
  activeContent: 'description',
  craftsVislibility: null,
  mdx: '',
  results: [],
  tabHandler: null,
  isAssistantEnabled: false,
  panelsLayout: 'tabs-left;code_editor-right',
  assistantSelections: {
    textSelection: null,
    codeSelection: null,
  },
}
