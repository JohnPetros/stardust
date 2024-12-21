'use client'

import type { TextBlockDto, QuestionDto } from '#dtos'

import { PageTransitionAnimation } from '@/ui/global/widgets/components/PageTransitionAnimation'
import { useLessonPage } from './useLessonPage'
import { LessonHeader } from './LessonHeader'
import { TheoryStage } from './TheoryStage'
import { QuizStage } from './QuizStage'

type LessonPageProps = {
  starId: string
  starName: string
  starNumber: number
  questionsDto: QuestionDto[]
  textsBlocksDto: TextBlockDto[]
}

export function LessonPage({
  starId,
  starName,
  starNumber,
  questionsDto,
  textsBlocksDto,
}: LessonPageProps) {
  const { scrollRef, stage, isTransitionVisible, handleLeavePage } = useLessonPage(
    starId,
    questionsDto,
    textsBlocksDto,
  )

  return (
    <>
      <PageTransitionAnimation isVisible={isTransitionVisible} />
      <div ref={scrollRef} className='relative overflow-x-hidden'>
        {stage !== 'rewards' && <LessonHeader onLeavePage={handleLeavePage} />}

        <main>
          {stage === 'theory' && <TheoryStage title={starName} number={starNumber} />}
          {stage === 'quiz' && <QuizStage leaveLesson={handleLeavePage} />}
        </main>
      </div>
    </>
  )
}
