import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { Question } from '@/@types/quiz'

export type LessonStoreState = {
  currentStage: 'theory' | 'quiz' | 'rewards'
  mdxComponentsCount: number
  renderedMdxComponents: number
  questions: Question[]
  currentQuestionIndex: number
  incorrectAnswersCount: number
  livesCount: number
  answerHandler: VoidFunction
  isAnswerCorrect: boolean
  isAnswerVerified: boolean
  isAnswered: boolean
}

export type LessonStoreActions = {
  showQuiz: () => void
  changeQuestion: () => void
  setQuestions: (categoriesIds: Question[]) => void
  setMdxComponentsCount: (mdxComponentsCount: number) => void
  setIsAnswered: (isAnswered: boolean) => void
  setIsAnswerCorrect: (isAnswered: boolean) => void
  setIsAnswerVerified: (isAnswered: boolean) => void
  setAnswerHandler: (answeredHandler: VoidFunction) => void
  incrementIncorrectAswersCount: () => void
  incrementRenderedMdxComponentsCount: () => void
  decrementLivesCount: () => void
  resetState: () => void
}

export type LessonStoreProps = {
  state: LessonStoreState
  actions: LessonStoreActions
}

const initialState: LessonStoreState = {
  currentStage: 'quiz',
  mdxComponentsCount: 0,
  renderedMdxComponents: 0,
  questions: [],
  currentQuestionIndex: 0,
  incorrectAnswersCount: 0,
  livesCount: 5,
  answerHandler: () => {},
  isAnswerCorrect: false,
  isAnswerVerified: false,
  isAnswered: false,
}

export const useLessonStore = create<LessonStoreProps>()(
  immer((set) => {
    return {
      state: initialState,
      actions: {
        showQuiz() {
          return set(({ state }) => {
            state.currentStage = 'quiz'
          })
        },
        setQuestions(questions: Question[]) {
          return set(({ state }) => {
            state.questions = questions
          })
        },
        setMdxComponentsCount(mdxComponentsCount: number) {
          return set(({ state }) => {
            state.mdxComponentsCount = mdxComponentsCount
          })
        },
        setRenderedMdxComponentsCount(renderedMdxComponentsCount: number) {
          return set(({ state }) => {
            state.renderedMdxComponents = renderedMdxComponentsCount
          })
        },
        setIsAnswered(isAnswered: boolean) {
          return set(({ state }) => {
            state.isAnswered = isAnswered
          })
        },
        setIsAnswerVerified(isAnswerVerified: boolean) {
          return set(({ state }) => {
            state.isAnswerVerified = isAnswerVerified
          })
        },
        setIsAnswerCorrect(isAnswerCorrect: boolean) {
          return set(({ state }) => {
            state.isAnswerCorrect = isAnswerCorrect
          })
        },
        setAnswerHandler(answerHandler: VoidFunction) {
          return set(({ state }) => {
            state.answerHandler = answerHandler
          })
        },
        incrementRenderedMdxComponentsCount() {
          return set(({ state }) => {
            state.renderedMdxComponents = state.renderedMdxComponents + 1
          })
        },
        incrementIncorrectAswersCount() {
          return set(({ state }) => {
            state.incorrectAnswersCount = state.incorrectAnswersCount + 1
          })
        },
        decrementLivesCount() {
          return set(({ state }) => {
            state.livesCount = state.livesCount - 1
          })
        },
        changeQuestion() {
          return set(({ state }) => {
            const nextQuestionIndex = state.currentQuestionIndex + 1

            let isEnd = false
            if (!state.questions[nextQuestionIndex]) {
              isEnd = true
            }

            state.currentQuestionIndex = nextQuestionIndex
            state.currentStage = isEnd ? 'rewards' : state.currentStage
            state.isAnswered = false
          })
        },
        resetState() {
          return set(({ actions }) => ({ state: initialState, actions }))
        },
      },
    }
  })
)
