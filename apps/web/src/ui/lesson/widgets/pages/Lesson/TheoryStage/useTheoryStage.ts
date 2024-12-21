import { useLessonStore } from '@/ui/app/stores/LessonStore'
import { useMdx } from '@/ui/global/widgets/components/Mdx/useMdx'
import { useEffect, useState } from 'react'

export function useTheoryStage() {
  const { getStageSlice, getTheorySlice } = useLessonStore()
  const { setStage } = getStageSlice()
  const { theory, setTheory } = getTheorySlice()
  const { parseTextBlocksToMdx } = useMdx()
  const [mdxTemplates, setMdxTemplates] = useState<string[]>([])

  function handleContinueButtonClick() {
    if (!theory) return

    setTheory(theory.nextTextBlock())
  }

  function handleQuizStageButtonClick() {
    setStage('quiz')
  }

  useEffect(() => {
    if (theory) {
      const mdxTemplates = parseTextBlocksToMdx(theory.textBlocks)
      setMdxTemplates(mdxTemplates)
    }
  }, [theory, parseTextBlocksToMdx])

  return {
    theory,
    mdxTemplates,
    handleContinueButtonClick,
    handleQuizStageButtonClick,
  }
}
