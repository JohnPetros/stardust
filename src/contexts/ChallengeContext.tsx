import { ReactNode, createContext, useReducer } from 'react'
import type { Challenge } from '@/types/challenge'

interface ChallengeProviderProps {
  children: ReactNode
}

type ChallengeState = {
  userCode: string
  challenge: Challenge | null
}

type ChallengeAction =
  | { type: 'setChallenge'; payload: Challenge }
  | { type: 'setUserCode'; payload: string }

type ChallengeValue = {
  state: ChallengeState
  dispatch: (action: ChallengeAction) => void
}

export const ChallengeContext = createContext({} as ChallengeValue)

const initialChallengeState: ChallengeState = {
  challenge: null,
  userCode: '',
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
