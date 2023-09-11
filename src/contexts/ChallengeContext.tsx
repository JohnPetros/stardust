import { ReactNode, createContext, useReducer } from 'react'
import type { Challenge, TestCase } from '@/types/challenge'

interface ChallengeProviderProps {
  children: ReactNode
}

type ChallengeState = {
  userCode: string
  challenge: Challenge | null
  isCodeRunning: boolean
}

type ChallengeAction =
  | { type: 'setChallenge'; payload: Challenge }
  | { type: 'setUserCode'; payload: string }
  | { type: 'handleUserCode'; payload: string }

type ChallengeValue = {
  state: ChallengeState
  dispatch: (action: ChallengeAction) => void
}

export const ChallengeContext = createContext({} as ChallengeValue)

const initialChallengeState: ChallengeState = {
  challenge: null,
  userCode: '',
  isCodeRunning: false,
}

function formatCode(code: string, { input }: Pick<TestCase, 'input'>) {
  return code
}

async function verifyTestCase(testCase: TestCase, code: string) {
  const { input } = testCase

  const formatedCode = formatCode(code, { input })

  console.log({ formatedCode })
}

async function handleUserCode(challenge: Challenge, code: string) {
  
  for (const testCase of challenge.test_cases) {
    await verifyTestCase(testCase, code)
  }
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
    case 'handleUserCode':
      if (state.challenge) handleUserCode(state.challenge, action.payload)
      return {
        ...state,
        isCodeRunning: true,
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
