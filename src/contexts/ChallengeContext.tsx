'use client'

import { ReactNode, createContext, useReducer } from 'react'
import type { Challenge } from '@/types/challenge'

type TabHandler = {
  showResultTab: VoidFunction
  showCodeTab: VoidFunction
}

interface ChallengeProviderProps {
  children: ReactNode
}

type ChallengeState = {
  userCode: string
  challenge: Challenge | null
  userOutput: string[]
  results: boolean[]
  isAnswerCorrect: boolean
  isAnswerVerified: boolean
  isEnd: boolean
  tabHandler: TabHandler
}

type ChallengeAction =
  | { type: 'setChallenge'; payload: Challenge }
  | { type: 'setUserCode'; payload: string }
  | { type: 'setUserOutput'; payload: string[] }
  | { type: 'setResults'; payload: boolean[] }
  | { type: 'setIsAnswerVerified'; payload: boolean }
  | { type: 'setIsAnswerCorrect'; payload: boolean }
  | { type: 'setIsEnd'; payload: boolean }
  | { type: 'setTabHandler'; payload: TabHandler }

type ChallengeValue = {
  state: ChallengeState
  dispatch: (action: ChallengeAction) => void
}

export const ChallengeContext = createContext({} as ChallengeValue)

const initialChallengeState: ChallengeState = {
  challenge: null,
  userCode: '',
  userOutput: [],
  results: [],
  isAnswerCorrect: false,
  isAnswerVerified: false,
  isEnd: false,
  tabHandler: {
    showCodeTab: () => {},
    showResultTab: () => {},
  },
}

function ChallengeReducer(
  state: ChallengeState,
  action: ChallengeAction
): ChallengeState {
  switch (action.type) {
    case 'setChallenge':
      return {
        ...state,
        challenge: action.payload,
      }
    case 'setUserCode':
      return {
        ...state,
        userCode: action.payload,
      }
    case 'setUserOutput':
      return {
        ...state,
        userOutput: action.payload,
      }
    case 'setResults':
      return {
        ...state,
        results: action.payload,
      }
    case 'setIsAnswerVerified':
      return {
        ...state,
        isAnswerVerified: action.payload,
      }
    case 'setIsAnswerCorrect':
      return {
        ...state,
        isAnswerCorrect: action.payload,
      }
    case 'setTabHandler':
      return {
        ...state,
        tabHandler: action.payload,
      }
    case 'setIsEnd':
      return {
        ...state,
        isEnd: action.payload,
      }
    default:
      return state
  }
}

export function ChallengeProvider({ children }: ChallengeProviderProps) {
  const [state, dispatch] = useReducer(ChallengeReducer, initialChallengeState)

  return (
    <ChallengeContext.Provider value={{ state, dispatch }}>
      {children}
    </ChallengeContext.Provider>
  )
}
