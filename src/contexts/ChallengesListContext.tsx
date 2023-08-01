import { ReactNode, createContext, useReducer } from 'react'

export type Status = 'all' | 'completed' | 'not-completed'
export type Difficulty = 'all' | 'easy' | 'medium' | 'hard'

type ChallengesListAction =
  | { type: 'setStatus'; payload: Status }
  | { type: 'setDifficulty'; payload: Difficulty }
  | { type: 'setCategoriesIds'; payload: string[] }
  | { type: 'setSearch'; payload: string }

type ChallengesListState = {
  status: Status
  difficulty: Difficulty
  categoriesIds: string[]
  search: string
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
  categoriesIds: [],
  search: '',
}

function ChallengesListReducer(
  state: ChallengesListState,
  action: ChallengesListAction
): ChallengesListState {
  switch (action.type) {
    case 'setStatus':
      return { ...state, status: action.payload }
    case 'setDifficulty':
      return { ...state, difficulty: action.payload }
    case 'setCategoriesIds':
      return { ...state, categoriesIds: action.payload }
    case 'setSearch':
      return { ...state, search: action.payload }
    default:
      return state
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
