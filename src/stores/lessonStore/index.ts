import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { INITIAL_LESSON_STORE_STATE } from './constants/initial-lesson-store-state'
import type { LessonStoreActions } from './types/LessonStoreActions'
import type { LessonStoreState } from './types/LessonStoreState'

import type { Question } from '@/@types/Quiz'

type LessonStoreProps = {
  state: LessonStoreState
  actions: LessonStoreActions
}

export const useLessonStore = create<LessonStoreProps>()(
  immer((set) => {
    return {
      state: INITIAL_LESSON_STORE_STATE,
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
          return set(({ actions }) => ({
            state: INITIAL_LESSON_STORE_STATE,
            actions,
          }))
        },
      },
    }
  })
)
