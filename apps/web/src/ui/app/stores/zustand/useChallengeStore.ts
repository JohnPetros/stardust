import { create, type StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { INITIAL_CHALLENGE_STORE_STATE } from '../ChallengeStore/constants'
import type { Challenge } from '@/@core/domain/entities'
import type {
  ChallengeStoreActions,
  ChallengeStoreState,
  PanelsLayout,
} from '../ChallengeStore/types'

type ChallengeStore = {
  state: ChallengeStoreState
  actions: ChallengeStoreActions
}

const challengeStore: StateCreator<
  ChallengeStore,
  [['zustand/persist', unknown], ['zustand/immer', never]],
  [],
  ChallengeStore
> = (set) => ({
  state: INITIAL_CHALLENGE_STORE_STATE,
  actions: {
    setChallenge(challenge: Challenge) {
      return set(({ state }) => {
        state.challenge = challenge
      })
    },

    setPanelsLayout(panelsLayout: PanelsLayout) {
      return set(({ state }) => {
        state.panelsLayout = panelsLayout
      })
    },

    resetState: () =>
      set(() => ({
        state: INITIAL_CHALLENGE_STORE_STATE,
      })),
  },
})

export const useZustandChallengeStore = create(
  persist(immer(challengeStore), {
    version: 1,
    name: 'challenge-store',
    storage: createJSONStorage(() => localStorage),
    partialize: (store) => {
      return {
        state: {
          panelsLayout: store.state.panelsLayout,
        },
      }
    },
  }),
)
