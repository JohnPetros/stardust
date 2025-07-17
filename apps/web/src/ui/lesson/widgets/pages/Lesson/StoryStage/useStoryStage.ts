import { useLessonStore } from '@/ui/lesson/stores/LessonStore'

export function useStoryStage() {
  const { getStageSlice, getStorySlice } = useLessonStore()
  const { setStage } = getStageSlice()
  const { story, setStory } = getStorySlice()

  function handleContinueButtonClick() {
    if (!story) return

    setStory(story.nextChunk())
  }

  function handleQuizStageButtonClick() {
    setStage('quiz')
  }

  return {
    story,
    handleContinueButtonClick,
    handleQuizStageButtonClick,
  }
}
