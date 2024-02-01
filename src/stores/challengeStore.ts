import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import type { Challenge } from '@/@types/challenge'
import type { Vote } from '@/@types/vote'

export type Layout =
  | 'tabs-right;code_editor-left'
  | 'tabs-left;code_editor-right'
  | 'code_editor-full'

type TabHandler = {
  showResultTab: VoidFunction
  showCodeTab: VoidFunction
}

type ChallengeState = {
  challenge: Challenge | null
  userOutput: string[]
  results: boolean[]
  mdx: string
  userVote: Vote
  isEnd: boolean
  incorrectAnswersAmount: number
  canShowComments: boolean
  canShowSolutions: boolean
  layout: Layout
  tabHandler: TabHandler | null
}

type ChallengeActionss = {
  setChallenge: (challenge: Challenge) => void
  setUserOutput: (challenge: string[]) => void
  setResults: (results: boolean[]) => void
  setMdx: (mdx: string) => void
  setUserVote: (useVote: Vote) => void
  setIsEnd: (isEnd: boolean) => void
  setTabHandler: (tabHandler: TabHandler) => void
  setLayout: (layout: Layout) => void
  setCanShowComments: (canShowComments: boolean) => void
  setCanShowSolutions: (canShowSolutions: boolean) => void
  incrementIncorrectAswersAmount: () => void
  resetState: () => void
}

type ChallengeStore = {
  state: ChallengeState
  actions: ChallengeActionss
}

const initialState: ChallengeState = {
  challenge: null,
  userOutput: [],
  userVote: null,
  results: [],
  mdx: '',
  isEnd: false,
  incorrectAnswersAmount: 0,
  tabHandler: null,
  layout: 'tabs-left;code_editor-right',
  canShowComments: false,
  canShowSolutions: false,
}
const challengeStore: StateCreator<
  ChallengeStore,
  [['zustand/persist', unknown], ['zustand/immer', never]],
  [],
  ChallengeStore
> = (set) => ({
  state: initialState,
  actions: {
    setChallenge(challenge: Challenge) {
      return set(({ state }: ChallengeStore) => {
        state.challenge = challenge
      })
    },
    setUserCode: (userCode: string) =>
      set(({ state }: ChallengeStore) => ({
        state: { ...state, userCode },
      })),
    setUserOutput: (userOutput: string[]) =>
      set(({ state }: ChallengeStore) => ({
        state: { ...state, userOutput },
      })),
    setUserVote: (userVote: Vote) =>
      set(({ state }: ChallengeStore) => ({
        state: { ...state, userVote },
      })),
    setResults: (results: boolean[]) =>
      set(({ state }: ChallengeStore) => ({
        state: { ...state, results },
      })),
    setMdx: (mdx: string) =>
      set(({ state }: ChallengeStore) => ({
        state: { ...state, mdx },
      })),
    setLayout: (layout: Layout) =>
      set(({ state }: ChallengeStore) => ({
        state: { ...state, layout },
      })),
    setTabHandler: (tabHandler: TabHandler) =>
      set(({ state }: ChallengeStore) => ({
        state: { ...state, tabHandler },
      })),
    setIsEnd: (isEnd: boolean) =>
      set(({ state, actions }: ChallengeStore) => ({
        state: { ...state, isEnd },
        actions,
      })),
    setCanShowComments: (canShowComments: boolean) =>
      set(({ state, actions }: ChallengeStore) => ({
        state: { ...state, canShowComments },
        actions,
      })),
    setCanShowSolutions: (canShowSolutions: boolean) =>
      set(({ state, actions }: ChallengeStore) => ({
        state: { ...state, canShowSolutions },
        actions,
      })),
    incrementIncorrectAswersAmount: () =>
      set(({ state }: ChallengeStore) => {
        const incorrectAnswersAmount =
          state.incorrectAnswersAmount === 4
            ? state.incorrectAnswersAmount
            : state.incorrectAnswersAmount + 1
        return {
          state: { ...state, incorrectAnswersAmount },
        }
      }),
    resetState: () =>
      set(() => ({
        state: initialState,
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
          layout: store.state.layout,
        },
      }
    },
  })
)
