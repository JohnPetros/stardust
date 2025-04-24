import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import type { LessonStage } from '@stardust/core/lesson/types'
import type { Story, Quiz } from '@stardust/core/lesson/structures'
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

        setStory(story: Story) {
          return set(({ state }) => {
            state.story = story
          })
        },

        setQuiz(quiz: Quiz | null) {
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
