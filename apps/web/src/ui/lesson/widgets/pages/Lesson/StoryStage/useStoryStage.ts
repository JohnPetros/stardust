import { useEffect, useState } from 'react'

import { useMdx } from '@/ui/global/widgets/components/Mdx/hooks/useMdx'
import { useLessonStore } from '@/ui/lesson/stores/LessonStore'

export function useStoryStage() {
  const { getStageSlice, getStorySlice } = useLessonStore()
  const { setStage } = getStageSlice()
  const { story, setStory } = getStorySlice()
  const { parseTextBlocksToMdx } = useMdx()
  const [textBlocks, setTextBlocks] = useState<string[]>([])

  function handleContinueButtonClick() {
    if (!story) return

    setStory(story.nextChunk())
  }

  function handleQuizStageButtonClick() {
    setStage('quiz')
  }

  useEffect(() => {
    if (story) {
      const textBlocks = parseTextBlocksToMdx(story.textBlocks)
      setTextBlocks(textBlocks)
    }
  }, [story, parseTextBlocksToMdx])

  return {
    story,
    textBlocks,
    handleContinueButtonClick,
    handleQuizStageButtonClick,
  }
}
