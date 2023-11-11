import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import type { Challenge } from '@/@types/challenge'

type TabHandler = {
  showResultTab: VoidFunction
  showCodeTab: VoidFunction
}

type ChallengeState = {
  userCode: string
  challenge: Challenge | null
  userOutput: string[]
  results: boolean[]
  isAnswerCorrect: boolean
  isAnswerVerified: boolean
  isEnd: boolean
  incorrectAnswersAmount: number
  isFirstRendering: boolean
  tabHandler: TabHandler | null
}

type ChallengeActionss = {
  setChallenge: (challenge: Challenge) => void
  setUserCode: (userCode: string) => void
  setUserOutput: (challenge: string[]) => void
  setResults: (results: boolean[]) => void
  setIsAnswerVerified: (isAnswerVerified: boolean) => void
  setIsAnswerCorrect: (isAnswerCorrect: boolean) => void
  setIsEnd: (isEnd: boolean) => void
  setTabHandler: (tabHandler: TabHandler) => void
  setIsFirstRendering: (isFirstRendering: boolean) => void
  incrementIncorrectAswersAmount: () => void
  resetState: () => void
}

type ChallengeStore = {
  state: ChallengeState
  actions: ChallengeActionss
}

const initialState: ChallengeState = {
  challenge: null,
  userCode: '',
  userOutput: [],
  results: [],
  isAnswerCorrect: false,
  isAnswerVerified: false,
  isEnd: false,
  incorrectAnswersAmount: 0,
  tabHandler: null,
  isFirstRendering: true,
}

export const useChallengeStore = create<ChallengeStore>()(
  immer((set) => {
    return {
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
        setResults: (results: boolean[]) =>
          set(({ state }: ChallengeStore) => ({
            state: { ...state, results },
          })),
        setTabHandler: (tabHandler: TabHandler) =>
          set(({ state }: ChallengeStore) => ({
            state: { ...state, tabHandler },
          })),
        setIsAnswerVerified: (isAnswerVerified: boolean) =>
          set(({ state, actions }: ChallengeStore) => ({
            state: { ...state, isAnswerVerified },
            actions,
          })),
        setIsAnswerCorrect: (isAnswerCorrect: boolean) =>
          set(({ state, actions }: ChallengeStore) => ({
            state: { ...state, isAnswerCorrect },
            actions,
          })),
        setIsEnd: (isEnd: boolean) =>
          set(({ state, actions }: ChallengeStore) => ({
            state: { ...state, isEnd },
            actions,
          })),
        setIsFirstRendering: (isFirstRendering: boolean) =>
          set(({ state, actions }: ChallengeStore) => ({
            state: { ...state, isFirstRendering },
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
    }
  })
)