import { create } from 'zustand'
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

type ChallengeAction = {
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
  action: ChallengeAction
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

export const useChallengeStore = create<ChallengeStore>((set) => {
  return {
    state: initialState,
    action: {
      setChallenge: (challenge: Challenge) =>
        set(({ state, action }: ChallengeStore) => ({
          state: { ...state, challenge },
          action,
        })),
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
        set(({ state, action }: ChallengeStore) => ({
          state: { ...state, isAnswerVerified },
          action,
        })),
      setIsAnswerCorrect: (isAnswerCorrect: boolean) =>
        set(({ state, action }: ChallengeStore) => ({
          state: { ...state, isAnswerCorrect },
          action,
        })),
      setIsEnd: (isEnd: boolean) =>
        set(({ state, action }: ChallengeStore) => ({
          state: { ...state, isEnd },
          action,
        })),
      setIsFirstRendering: (isFirstRendering: boolean) =>
        set(({ state, action }: ChallengeStore) => ({
          state: { ...state, isFirstRendering },
          action,
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
