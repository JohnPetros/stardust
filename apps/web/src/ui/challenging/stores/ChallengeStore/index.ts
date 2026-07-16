import type { ChallengeStoreState } from './types'
import { useZustandChallengeStore } from '../zustand/useZustandChallengeStore'
import { INITIAL_CHALLENGE_STORE_STATE } from './constants'

export function useChallengeStore() {
  return {
    getChallengeSlice() {
      const challenge = useZustandChallengeStore((store) => store.state.challenge)
      const setChallenge = useZustandChallengeStore((store) => store.actions.setChallenge)

      return {
        challenge,
        setChallenge,
      }
    },

    getActiveContentSlice() {
      const activeContent = useZustandChallengeStore((store) => store.state.activeContent)
      const setActiveContent = useZustandChallengeStore(
        (store) => store.actions.setActiveContent,
      )

      return {
        activeContent,
        setActiveContent,
      }
    },

    getCraftsVisibilitySlice() {
      const craftsVislibility = useZustandChallengeStore(
        (store) => store.state.craftsVislibility,
      )
      const setCraftsVislibility = useZustandChallengeStore(
        (store) => store.actions.setCraftsVisibility,
      )

      return {
        craftsVislibility,
        setCraftsVislibility,
      }
    },

    getPanelsLayoutSlice() {
      const panelsLayout = useZustandChallengeStore((store) => store.state.panelsLayout)
      const setPanelsLayout = useZustandChallengeStore(
        (store) => store.actions.setPanelsLayout,
      )

      return {
        panelsLayout,
        setPanelsLayout,
      }
    },

    getPanelOrderSlice() {
      // biome-ignore lint/correctness/useHookAtTopLevel: ChallengeStore exposes slice getters using the existing store API pattern.
      const panelOrder = useZustandChallengeStore((store) => store.state.panelOrder)
      // biome-ignore lint/correctness/useHookAtTopLevel: ChallengeStore exposes slice getters using the existing store API pattern.
      const setPanelOrder = useZustandChallengeStore(
        (store) => store.actions.setPanelOrder,
      )

      return {
        panelOrder,
        setPanelOrder,
      }
    },

    getPanelsOffsetSlice() {
      // biome-ignore lint/correctness/useHookAtTopLevel: ChallengeStore exposes slice getters using the existing store API pattern.
      const panelsOffset = useZustandChallengeStore((store) => store.state.panelsOffset)
      // biome-ignore lint/correctness/useHookAtTopLevel: ChallengeStore exposes slice getters using the existing store API pattern.
      const setPanelsOffset = useZustandChallengeStore(
        (store) => store.actions.setPanelsOffset,
      )

      return {
        panelsOffset,
        setPanelsOffset,
      }
    },

    resetPanelsLayout() {
      return useZustandChallengeStore.getState().actions.resetPanelsLayout()
    },

    getResultsSlice() {
      const results = useZustandChallengeStore((store) => store.state.results)
      const setResults = useZustandChallengeStore((store) => store.actions.setResults)

      return {
        results,
        setResults,
      }
    },

    getMdxSlice() {
      const mdx = useZustandChallengeStore((store) => store.state.mdx)
      const setMdx = useZustandChallengeStore((store) => store.actions.setMdx)

      return {
        mdx,
        setMdx,
      }
    },

    getTabHandlerSlice() {
      const tabHandler = useZustandChallengeStore((store) => store.state.tabHandler)
      const setTabHandler = useZustandChallengeStore(
        (store) => store.actions.setTabHandler,
      )

      return {
        tabHandler,
        setTabHandler,
      }
    },

    getIsAssistantEnabledSlice() {
      const isAssistantEnabled = useZustandChallengeStore(
        (store) => store.state.isAssistantEnabled,
      )
      const setIsAssistantEnabled = useZustandChallengeStore(
        (store) => store.actions.setIsAssistantEnabled,
      )

      return {
        isAssistantEnabled,
        setIsAssistantEnabled,
      }
    },

    getAssistantSelectionsSlice() {
      const assistantSelections = useZustandChallengeStore(
        (store) => store.state.assistantSelections,
      )
      const setTextSelection = useZustandChallengeStore(
        (store) => store.actions.setTextSelection,
      )
      const setCodeSelection = useZustandChallengeStore(
        (store) => store.actions.setCodeSelection,
      )
      const clearTextSelection = useZustandChallengeStore(
        (store) => store.actions.clearTextSelection,
      )
      const clearCodeSelection = useZustandChallengeStore(
        (store) => store.actions.clearCodeSelection,
      )
      const clearAssistantSelections = useZustandChallengeStore(
        (store) => store.actions.clearAssistantSelections,
      )

      return {
        assistantSelections,
        setTextSelection,
        setCodeSelection,
        clearTextSelection,
        clearCodeSelection,
        clearAssistantSelections,
      }
    },

    resetStore() {
      const { state } = useZustandChallengeStore.getState()

      return useZustandChallengeStore.setState({
        state: {
          ...INITIAL_CHALLENGE_STORE_STATE,
          panelOrder: state.panelOrder,
          panelsOffset: state.panelsOffset,
        },
      })
    },
  }
}

export const ChallengeStore = {
  getState() {
    return useZustandChallengeStore.getState().state
  },
  setState(state: ChallengeStoreState) {
    return useZustandChallengeStore.setState({ state })
  },
}
