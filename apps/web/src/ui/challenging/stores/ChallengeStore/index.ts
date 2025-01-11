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

    getSolutionContentSlice() {
      const solutionContent = useZustandChallengeStore(
        (store) => store.state.solutionContent,
      )
      const setSolutionContent = useZustandChallengeStore(
        (store) => store.actions.setSolutionContent,
      )

      return {
        solutionContent,
        setSolutionContent,
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

    getResults() {
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

    resetStore() {
      return useZustandChallengeStore.setState({ state: INITIAL_CHALLENGE_STORE_STATE })
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
