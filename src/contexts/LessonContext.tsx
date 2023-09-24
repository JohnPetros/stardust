import { ReactNode, createContext, useReducer } from 'react'

import type { Question } from '@/types/quiz'
import type { Text } from '@/types/text'

type LessonState = {
  currentStage: 'theory' | 'quiz' | 'end'
  texts: Text[]
  renderedTextsAmount: number
  questions: Question[]
  currentQuestionIndex: number
  incorrectAnswersAmount: number
  livesAmount: number
  secondsAmount: number
  answerHandler: () => void
  isAnswerCorrect: boolean
  isAnswerVerified: boolean
  isAnswered: boolean
}

type LessonAction =
  | { type: 'showQuiz' }
  | { type: 'changeQuestion' }
  | { type: 'setQuestions'; payload: Question[] }
  | { type: 'setTexts'; payload: Text[] }
  | { type: 'setIsAnswered'; payload: boolean }
  | { type: 'setIsAnswerCorrect'; payload: boolean }
  | { type: 'setIsAnswerVerified'; payload: boolean }
  | { type: 'setAnswerHandler'; payload: () => void }
  | { type: 'incrementIncorrectAswersAmount' }
  | { type: 'incrementRenderedTextsAmount' }
  | { type: 'incrementSecondsAmount' }
  | { type: 'decrementLivesAmount' }
  | { type: 'resetState' }

type LessonValue = {
  state: LessonState
  dispatch: (action: LessonAction) => void
}

export const LessonContext = createContext({} as LessonValue)

const initialLessonState: LessonState = {
  currentStage: 'quiz',
  texts: [],
  renderedTextsAmount: 0,
  questions: [],
  currentQuestionIndex: 0,
  incorrectAnswersAmount: 0,
  livesAmount: 5,
  secondsAmount: 0,
  answerHandler: () => {},
  isAnswerCorrect: false,
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
    case 'setTexts':
      return {
        ...state,
        texts: action.payload,
      }
    case 'setQuestions':
      return {
        ...state,
        questions: action.payload,
      }
    case 'setIsAnswered':
      return {
        ...state,
        isAnswered: action.payload,
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
    case 'setAnswerHandler':
      return {
        ...state,
        answerHandler: action.payload,
      }
    case 'incrementRenderedTextsAmount':
      return {
        ...state,
        renderedTextsAmount: state.renderedTextsAmount + 1,
      }
    case 'incrementIncorrectAswersAmount':
      return {
        ...state,
        incorrectAnswersAmount: state.incorrectAnswersAmount + 1,
      }
    case 'incrementSecondsAmount':
      return {
        ...state,
        secondsAmount: state.secondsAmount + 1,
      }
    case 'decrementLivesAmount':
      return {
        ...state,
        livesAmount:
          state.livesAmount === 0 ? state.livesAmount : state.livesAmount - 1,
      }
    case 'changeQuestion':
      const nextQuestionIndex = state.currentQuestionIndex + 1

      let isEnd = false
      if (!state.questions[nextQuestionIndex]) {
        isEnd = true
      }

      return {
        ...state,
        currentQuestionIndex: nextQuestionIndex,
        currentStage: isEnd ? 'end' : state.currentStage,
        isAnswered: false,
      }
    case 'resetState':
      return initialLessonState
    default:
      return state
  }
}

interface LessonProviderProps {
  children: ReactNode
}

export const LessonProvider = ({ children }: LessonProviderProps) => {
  const [state, dispatch] = useReducer(LessonReducer, initialLessonState)

  return (
    <LessonContext.Provider value={{ state, dispatch }}>
      {children}
    </LessonContext.Provider>
  )
}
