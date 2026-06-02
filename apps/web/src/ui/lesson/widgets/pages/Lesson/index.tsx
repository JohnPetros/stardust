'use client'

import { useLessonPage } from './useLessonPage'
import type { TextBlockDto } from '@stardust/core/global/entities/dtos'
import type { QuestionDto } from '@stardust/core/lesson/entities/dtos'
import { LessonPageView } from './LessonPageView'
import { useRef } from 'react'
import { useRestContext } from '@/ui/global/hooks/useRestContext'

type LessonPageProps = {
  starId: string
  starName: string
  starNumber: number
  questionsDto: QuestionDto[]
  textsBlocksDto: TextBlockDto[]
}

export const LessonPage = ({
  starId,
  starName,
  starNumber,
  questionsDto,
  textsBlocksDto,
}: LessonPageProps) => {
  const { storageService } = useRestContext()
  const scrollRef = useRef<HTMLDivElement>(null)
  const { stage, isTransitionVisible, handleLeavePage } = useLessonPage(
    starId,
    questionsDto,
    textsBlocksDto,
    storageService,
  )

  return (
    <LessonPageView
      starId={starId}
      starName={starName}
      starNumber={starNumber}
      stage={stage}
      scrollRef={scrollRef}
      isTransitionVisible={isTransitionVisible}
      onLeavePage={handleLeavePage}
    />
  )
}
