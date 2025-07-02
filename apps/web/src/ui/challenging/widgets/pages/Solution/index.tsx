'use client'

import type { SolutionDto } from '@stardust/core/challenging/entities/dtos'

import { useSolutionPage } from './useSolutionPage'
import { Id, Slug } from '@stardust/core/global/structures'
import { useRest } from '@/ui/global/hooks/useRest'
import { SolutionPageView } from './SolutionPageView'

type SolutionPageProps = {
  savedSolutionDto: SolutionDto | null
  challengeId: string
  challengeSlug: string
}

export const SolutionPage = ({
  savedSolutionDto,
  challengeId,
  challengeSlug,
}: SolutionPageProps) => {
  const { challengingService } = useRest()
  const {
    solutionTitle,
    solutionContent,
    isActionDisable,
    canExecute,
    isFailure,
    isSuccess,
    isExecuting,
    handleTitleChange,
    handleContentChange,
    handleSolutionPost,
    handleSolutionEdit,
  } = useSolutionPage({
    challengingService,
    savedSolutionDto,
    challengeId: Id.create(challengeId),
    challengeSlug: Slug.create(challengeSlug),
  })

  return (
    <SolutionPageView
      savedSolutionDto={savedSolutionDto}
      challengeSlug={challengeSlug}
      solutionTitle={solutionTitle}
      solutionContent={solutionContent}
      isActionDisable={isActionDisable}
      canExecute={canExecute}
      isFailure={isFailure}
      isSuccess={isSuccess}
      isExecuting={isExecuting}
      onTitleChange={handleTitleChange}
      onContentChange={handleContentChange}
      onSolutionPost={handleSolutionPost}
      onSolutionEdit={handleSolutionEdit}
    />
  )
}
