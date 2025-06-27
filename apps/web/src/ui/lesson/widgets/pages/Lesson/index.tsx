'use client'

import { useLessonPage } from './useLessonPage'
import type { TextBlockDto } from '@stardust/core/global/entities/dtos'
import type { QuestionDto } from '@stardust/core/lesson/entities/dtos'
import { LessonPageView } from './LessonPageView'
import { useRef } from 'react'

type LessonPageProps = {
  starId: string
  starName: string
  starNumber: number
  storyContent: string
  questionsDto: QuestionDto[]
  textsBlocksDto: TextBlockDto[]
}

export const LessonPage = ({
  starId,
  starName,
  starNumber,
  storyContent,
  questionsDto,
  textsBlocksDto,
}: LessonPageProps) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { stage, isTransitionVisible, handleLeavePage } = useLessonPage(
    starId,
    questionsDto,
    textsBlocksDto,
    storyContent,
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
