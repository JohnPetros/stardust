import { useZustandChallengeStore } from '../zustand/useChallengeStore'
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
