import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import type { Challenge } from '@stardust/core/challenging/entities'
import type { ChallengeCraftsVisilibity } from '@stardust/core/challenging/structs'

import { INITIAL_CHALLENGE_STORE_STATE } from '../ChallengeStore/constants'
import type {
  ChallengeStoreActions,
  ChallengeStoreState,
  PanelsLayout,
} from '../ChallengeStore/types'
import type { ChallengeStore } from '../ChallengeStore/types/ChallengeStore'

export const useZustandChallengeStore = create<ChallengeStore>()(
  immer((set) => {
    return {
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

        setCraftsVisibility(craftsVislibility: ChallengeCraftsVisilibity) {
          return set(({ state }) => {
            state.craftsVislibility = craftsVislibility
          })
        },

        setTabHandler(tabHandler: TabHandler) {
          return set(({ state }) => {
            state.tabHandler = tabHandler
          })
        },

        resetStore() {
          return set(({ actions }) => ({
            state: INITIAL_CHALLENGE_STORE_STATE,
            actions,
          }))
        },
      },
    }
  }),
)
