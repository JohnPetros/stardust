import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export type Status = 'all' | 'completed' | 'not-completed'
export type Difficulty = 'all' | 'easy' | 'medium' | 'hard'

type ChallengesListStoreState = {
  status: Status
  difficulty: Difficulty
  categoriesIds: string[]
  search: string
}

type ChallengesListStoreActions = {
  setStatus: (status: Status) => void
  setDifficulty: (difficulty: Difficulty) => void
  setCategoriesIds: (categoriesIds: string[]) => void
  setSearch: (search: string) => void
}

type ChallengesListStoreProps = {
  state: ChallengesListStoreState
  actions: ChallengesListStoreActions
}

const initialState: ChallengesListStoreState = {
  status: 'all',
  difficulty: 'all',
  categoriesIds: [],
  search: '',
}

export const useChallengesListStore = create<ChallengesListStoreProps>()(
  immer((set) => {
    return {
      state: initialState,
      actions: {
        setSearch(search: string) {
          return set(({ state }) => {
            state.search = search
          })
        },
        setCategoriesIds(categoriesIds: string[]) {
          return set(({ state }) => {
            state.categoriesIds = categoriesIds
          })
        },
        setStatus(status: Status) {
          return set(({ state }) => {
            state.status = status
          })
        },
        setDifficulty(difficulty: Difficulty) {
          return set(({ state }) => {
            state.difficulty = difficulty
          })
        },
      },
    }
  })
)
