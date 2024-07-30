import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import type { Theory, Quiz } from '@/@core/domain/structs'
import type { LessonStage } from '@/@core/domain/types'
import type { LessonStore } from '../LessonStore/types'
import { INITIAL_LESSON_STATE } from '../LessonStore/constants'

export const useZustandLessonStore = create<LessonStore>()(
  immer((set) => {
    return {
      state: INITIAL_LESSON_STATE,
      actions: {
        setStage(stage: LessonStage) {
          return set(({ state }) => {
            state.stage = stage
          })
        },

        setTheory(theory: Theory) {
          return set(({ state }) => {
            state.theory = theory
          })
        },

        setQuiz(quiz: Quiz) {
          return set(({ state }) => {
            state.quiz = quiz
          })
        },

        resetStore() {
          return set(({ actions }) => ({
            state: INITIAL_LESSON_STATE,
            actions,
          }))
        },
      },
    }
  }),
)
