import type { LessonState } from './types'
import { useZustandLessonStore } from '../zustand/useZustandLessonStore'
import { INITIAL_LESSON_STATE } from './constants'

export function useLessonStore() {
  return {
    getStorySlice() {
      const story = useZustandLessonStore((store) => store.state.story)
      const setStory = useZustandLessonStore((store) => store.actions.setStory)

      return {
        story,
        setStory,
      }
    },

    getStageSlice() {
      const stage = useZustandLessonStore((store) => store.state.stage)
      const setStage = useZustandLessonStore((store) => store.actions.setStage)

      return {
        stage,
        setStage,
      }
    },

    getQuizSlice() {
      const quiz = useZustandLessonStore((store) => store.state.quiz)
      const setQuiz = useZustandLessonStore((store) => store.actions.setQuiz)

      return {
        quiz,
        setQuiz,
      }
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
