'use client'

import type { QuestionDto } from '@stardust/core/lesson/dtos'
import type { TextBlockDto } from '@stardust/core/global/dtos'

import { PageTransitionAnimation } from '@/ui/global/widgets/components/PageTransitionAnimation'
import { useLessonPage } from './useLessonPage'
import { LessonHeader } from './LessonHeader'
import { StoryStage } from './StoryStage'
import { QuizStage } from './QuizStage'

type LessonPageProps = {
  starId: string
  starName: string
  starNumber: number
  storyContent: string
  questionsDto: QuestionDto[]
  textsBlocksDto: TextBlockDto[]
}

export function LessonPage({
  starId,
  starName,
  starNumber,
  storyContent,
  questionsDto,
  textsBlocksDto,
}: LessonPageProps) {
  const { scrollRef, stage, isTransitionVisible, handleLeavePage } = useLessonPage(
    starId,
    questionsDto,
    textsBlocksDto,
    storyContent,
  )

  return (
    <>
      <PageTransitionAnimation isVisible={isTransitionVisible} />
      <div ref={scrollRef} className='relative overflow-x-hidden'>
        {stage !== 'rewarding' && <LessonHeader onLeavePage={handleLeavePage} />}

        <main>
          {stage === 'story' && <StoryStage title={starName} number={starNumber} />}
          {stage === 'quiz' && <QuizStage leaveLesson={handleLeavePage} />}
        </main>
      </div>
    </>
  )
}
