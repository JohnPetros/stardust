import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import type { Challenge } from '@stardust/core/challenging/entities'
import type { ChallengeCraftsVisibility } from '@stardust/core/challenging/structures'
import { INITIAL_CHALLENGE_STORE_STATE } from '../ChallengeStore/constants'
import type {
  ChallengeStore,
  ChallengeContent,
  PanelsLayout,
  TabHandler,
} from '../ChallengeStore/types'

export const useZustandChallengeStore = create<ChallengeStore>()(
  immer((set) => {
    return {
      state: INITIAL_CHALLENGE_STORE_STATE,
      actions: {
        setChallenge(challenge: Challenge | null) {
          return set(({ state }) => {
            state.challenge = challenge
          })
        },

        setActiveContent(activeContent: ChallengeContent) {
          return set(({ state }) => {
            state.activeContent = activeContent
          })
        },

        setPanelsLayout(panelsLayout: PanelsLayout) {
          return set(({ state }) => {
            state.panelsLayout = panelsLayout
          })
        },

        setResults(results: boolean[]) {
          return set(({ state }) => {
            state.results = results
          })
        },

        setCraftsVisibility(craftsVislibility: ChallengeCraftsVisibility) {
          return set(({ state }) => {
            state.craftsVislibility = craftsVislibility
          })
        },

        setTabHandler(tabHandler: TabHandler) {
          return set(({ state }) => {
            state.tabHandler = tabHandler
          })
        },

        setMdx(mdx: string) {
          return set(({ state }) => {
            state.mdx = mdx
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
