import { ReactNode, createContext, useReducer } from 'react'

export type Status = 'all' | 'completed' | 'not-completed'
export type Difficulty = 'all' | 'easy' | 'medium' | 'hard'

type ChallengesListAction =
  | { type: 'setStatus'; payload: Status }
  | { type: 'setDifficulty'; payload: Difficulty }

type ChallengesListState = {
  status: Status
  difficulty: Difficulty
}

interface ChallengesListProviderProps {
  children: ReactNode
}

interface ChallengesListContextValue {
  state: ChallengesListState
  dispatch: (action: ChallengesListAction) => void
}

const initialChallengesListState: ChallengesListState = {
  status: 'all',
  difficulty: 'all',
}

function ChallengesListReducer(
  state: ChallengesListState,
  action: ChallengesListAction
) {
  switch (action.type) {
    case 'setStatus':
      return { ...state, status: action.payload }
    case 'setDifficulty':
      return { ...state, difficulty: action.payload }
    default:
      return initialChallengesListState
  }
}

export const ChallengesListContext = createContext(
  {} as ChallengesListContextValue
)

export function ChallengesListProvider({
  children,
}: ChallengesListProviderProps) {
  const [state, dispatch] = useReducer(
    ChallengesListReducer,
    initialChallengesListState
  )

  return (
    <ChallengesListContext.Provider value={{ state, dispatch }}>
      {children}
    </ChallengesListContext.Provider>
  )
}
