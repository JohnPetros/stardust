import { ReactNode, createContext, useReducer } from 'react'

import type { Question } from '@/types/Question'
import type { Text } from '@/types/text'

type Stage = 'theory' | 'quiz' | 'end'

type LessonState = {
  currentStage: Stage
  texts: Text[]
  renderedTextsAmount: number,
  questions: Question[]
  currentQuestionIndex: number
  wrongsAmount: number
  livesAmount: number
  secondsAmount: number
  verifyAnswer: () => void
  isAnswerWrong: boolean
  isAnswerVerified: boolean
  isAnswered: boolean
}

type LessonAction = { type: 'showQuiz' } | { type: 'changeQuestion' }

type LessonValue = {
  state: LessonState
  dispatch: (action: LessonAction) => void
}

export const LessonContext = createContext({} as LessonValue)

const initialState: LessonState = {
  currentStage: 'theory',
  texts: [],
  renderedTextsAmount: 0,
  questions: [],
  currentQuestionIndex: 0,
  wrongsAmount: 0,
  livesAmount: 5,
  secondsAmount: 0,
  verifyAnswer: () => {},
  isAnswerWrong: false,
  isAnswerVerified: false,
  isAnswered: false,
}

function LessonReducer(state: LessonState, action: LessonAction): LessonState {
  switch (action.type) {
    case 'showQuiz':
      return {
        ...state,
        currentStage: 'quiz',
      }
    default:
      return state
  }
}

interface LessonProviderProps {
  children: ReactNode
}

export const LessonProvider = ({ children }: LessonProviderProps) => {
  const [state, dispatch] = useReducer(LessonReducer, initialState)

  return (
    <LessonContext.Provider value={{ state, dispatch }}>
      {children}
    </LessonContext.Provider>
  )
}