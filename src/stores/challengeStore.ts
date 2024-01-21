import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import type { Challenge } from '@/@types/challenge'
import type { Vote } from '@/@types/vote'

type TabHandler = {
  showResultTab: VoidFunction
  showCodeTab: VoidFunction
}

type ChallengeState = {
  userCode: string
  challenge: Challenge | null
  userOutput: string[]
  results: boolean[]
  mdx: string
  userVote: Vote
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
  setMdx: (mdx: string) => void
  setIsAnswerVerified: (isAnswerVerified: boolean) => void
  setIsAnswerCorrect: (isAnswerCorrect: boolean) => void
  setUserVote: (useVote: Vote) => void
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
  userVote: null,
  results: [],
  mdx: '',
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
