import { useLessonStore } from '@/infra/stores/LessonStore'
import { useMdx } from '@/modules/global/components/shared/Mdx/useMdx'
import { useEffect, useState } from 'react'

export function useTheoryStage() {
  const { useTheory, useStage } = useLessonStore()
  const { setStage } = useStage()
  const { theory, setTheory } = useTheory()
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
