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
  tabHandler: TabHandler | null
}

type ChallengeAction = {}

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
}

export const useChallengeStore = create<ChallengeStore>((set) => ({
  state: initialState,
  action: {
    setChallenge: (challenge: Challenge) =>
      set(({ state }: ChallengeStore) => ({
        state: { ...state, challenge },
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
    setIsAnswerCorrect: (isAnswerCorrect: boolean) =>
      set(({ state }: ChallengeStore) => ({
        state: { ...state, isAnswerCorrect },
      })),
    setIsEnd: (isEnd: boolean) =>
      set(({ state, action }: ChallengeStore) => ({
        state: { ...state, isEnd },
        action,
      })),
    incrementIncorrectAswersAmount: (incorrectAnswersAmount: number) =>
      set(({ state }: ChallengeStore) => ({
        state: { ...state, incorrectAnswersAmount },
      })),
    resetState: () =>
      set(() => ({
        state: initialState,
      })),
  },
}))
