import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { INITIAL_CHALLENGE_STORE_STATE } from './constants/initial-challenge-store-state'
import type { ChallengeStoreActions } from './types/ChallengeStoreActions'
import type { ChallengeStoreState } from './types/ChallengeStoreState'
import type { PanelsLayout } from './types/PanelsLayout'
import type { TabHandler } from './types/TabHandler'

import type {
  Challenge,
  ChallengeTestCaseExpectedOutput,
} from '@/@types/Challenge'
import type { Vote } from '@/@types/Vote'

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
        // @ts-ignore
        state.challenge = challenge
      })
    },

    setUserOutput(userOutput: ChallengeTestCaseExpectedOutput[]) {
      return set(({ state }) => {
        state.userOutput = userOutput
      })
    },

    setUserVote(userVote: Vote) {
      return set(({ state }) => {
        state.userVote = userVote
      })
    },

    setResults(results: boolean[]) {
      return set(({ state }) => {
        state.results = results
      })
    },

    setMdx(mdx: string) {
      return set(({ state }) => {
        state.mdx = mdx
      })
    },

    setPanelsLayout(panelsLayout: PanelsLayout) {
      return set(({ state }) => {
        state.panelsLayout = panelsLayout
      })
    },

    setTabHandler(tabHandler: TabHandler) {
      return set(({ state }) => {
        state.tabHandler = tabHandler
      })
    },

    setIsEnd(isEnd: boolean) {
      return set(({ state }) => {
        state.isEnd = isEnd
      })
    },

    setCanShowComments(canShowComments: boolean) {
      return set(({ state }) => {
        state.canShowComments = canShowComments
      })
    },

    setCanShowSolutions(canShowSolutions: boolean) {
      return set(({ state }) => {
        state.canShowSolutions = canShowSolutions
      })
    },

    incrementIncorrectAswersAmount() {
      return set(({ state }) => {
        state.incorrectAnswersAmount + 1
      })
    },

    resetState: () =>
      set(() => ({
        state: INITIAL_CHALLENGE_STORE_STATE,
      })),
  },
})

export const useChallengeStore = create(
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
  })
)
