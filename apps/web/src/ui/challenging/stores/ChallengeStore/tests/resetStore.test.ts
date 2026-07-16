import { ChallengeStore, useChallengeStore } from '..'
import { INITIAL_CHALLENGE_STORE_STATE } from '../constants'
import type { ChallengeStoreState } from '../types'

describe('ChallengeStore resetStore', () => {
  afterEach(() => {
    ChallengeStore.setState(INITIAL_CHALLENGE_STORE_STATE)
  })

  it('should preserve dockable panel layout state when resetting page state', () => {
    const panelOrder: ChallengeStoreState['panelOrder'] = [
      'code_editor',
      'tabs',
      'assistant',
    ]
    const panelsOffset: ChallengeStoreState['panelsOffset'] = {
      tabsPanelSize: 30,
      codeEditorPanelSize: 46,
      assistantPanelSize: 24,
    }

    ChallengeStore.setState({
      ...INITIAL_CHALLENGE_STORE_STATE,
      activeContent: 'result',
      panelOrder,
      panelsOffset,
      results: [true],
    })

    useChallengeStore().resetStore()

    expect(ChallengeStore.getState()).toEqual({
      ...INITIAL_CHALLENGE_STORE_STATE,
      panelOrder,
      panelsOffset,
    })
  })
})
