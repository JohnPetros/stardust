import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { Question } from '@/@types/quiz'
import type { Text } from '@/@types/text'

type LessonStoreState = {
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

type LessonStoreActions = {
  showQuiz: () => void
  changeQuestion: () => void
  setQuestions: (categoriesIds: Question[]) => void
  setTexts: (texts: Text[]) => void
  setIsAnswered: (isAnswered: boolean) => void
  setIsAnswerCorrect: (isAnswered: boolean) => void
  setIsAnswerVerified: (isAnswered: boolean) => void
  setAnswerHandler: (answeredHandler: VoidFunction) => void
  incrementIncorrectAswersAmount: () => void
  incrementRenderedTextsAmount: () => void
  incrementSecondsAmount: () => void
  decrementLivesAmount: () => void
  resetState: () => void
}

type LessonStoreProps = {
  state: LessonStoreState
  actions: LessonStoreActions
}

const initialState: LessonStoreState = {
  currentStage: 'theory',
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
        setTexts(texts: Text[]) {
          return set(({ state }) => {
            state.texts = texts
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
        incrementRenderedTextsAmount() {
          return set(({ state }) => {
            state.renderedTextsAmount = state.renderedTextsAmount + 1
          })
        },
        incrementSecondsAmount() {
          return set(({ state }) => {
            state.secondsAmount = state.secondsAmount + 1
          })
        },
        incrementIncorrectAswersAmount() {
          return set(({ state }) => {
            state.incorrectAnswersAmount = state.incorrectAnswersAmount + 1
          })
        },
        decrementLivesAmount() {
          return set(({ state }) => {
            state.livesAmount = state.livesAmount + 1
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
            state.currentStage = isEnd ? 'end' : state.currentStage
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
