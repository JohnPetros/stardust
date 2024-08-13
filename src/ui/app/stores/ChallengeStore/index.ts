import type { ChallengeStoreState } from './types'
import { useZustandChallengeStore } from '../zustand/useChallengeStore'
import { INITIAL_CHALLENGE_STORE_STATE } from '../ChallengeStore/constants'

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
