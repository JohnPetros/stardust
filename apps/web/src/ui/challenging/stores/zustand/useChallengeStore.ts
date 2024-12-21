import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import type { Challenge } from '@/@core/domain/entities'
import type { ChallengesCraftVisilibity } from '@/@core/domain/structs'

import { INITIAL_CHALLENGE_STORE_STATE } from '../ChallengeStore/constants'
import type { PanelsLayout, ChallengeStore, TabHandler } from '../ChallengeStore/types'

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

        setCraftsVisibility(craftsVislibility: ChallengesCraftVisilibity) {
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
