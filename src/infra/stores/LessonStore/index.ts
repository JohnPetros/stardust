import type { LessonState } from './types'
import { useZustandLessonStore } from '../zustand/useLessonStore'
import { INITIAL_LESSON_STATE } from './constants'

export function useLessonStore() {
  return {
    get theory() {
      return useZustandLessonStore((store) => store.state.theory)
    },
    get setTheory() {
      return useZustandLessonStore((store) => store.actions.setTheory)
    },

    get stage() {
      return useZustandLessonStore((store) => store.state.stage)
    },
    get setStage() {
      return useZustandLessonStore((store) => store.actions.setStage)
    },

    get quiz() {
      return useZustandLessonStore((store) => store.state.quiz)
    },

    get setQuiz() {
      return useZustandLessonStore((store) => store.actions.setQuiz)
    },

    get answerHandler() {
      return useZustandLessonStore((store) => store.state.answerHandler)
    },

    get setAnswerHandler() {
      return useZustandLessonStore((store) => store.actions.setAnswerHandler)
    },

    resetStore() {
      return useZustandLessonStore.setState({ state: INITIAL_LESSON_STATE })
    },
  }
}

export const lessonStore = {
  getState() {
    return useZustandLessonStore.getState().state
  },
  setState(state: LessonState) {
    return useZustandLessonStore.setState({ state })
  },
}
