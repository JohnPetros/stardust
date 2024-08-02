'use client'

import type { TextBlockDTO, QuestionDTO } from '@/@core/dtos'
import { PageTransitionAnimation } from '@/modules/global/components/shared/PageTransitionAnimation'
import { useLessonPage } from './useLessonPage'
import { LessonHeader } from './LessonHeader'
import { TheoryStage } from './TheoryStage'
import { QuizStage } from './QuizStage'
// import { LessonHeader } from './LessonHeader'
// import { TheoryStage } from './TheoryStage'

type LessonPageProps = {
  starId: string
  starName: string
  starNumber: number
  questionsDTO: QuestionDTO[]
  textsBlocksDTO: TextBlockDTO[]
}

export function LessonPage({
  starId,
  starName,
  starNumber,
  questionsDTO,
  textsBlocksDTO,
}: LessonPageProps) {
  const { scrollRef, stage, isTransitionVisible, handleLeavePage } = useLessonPage(
    starId,
    questionsDTO,
    textsBlocksDTO,
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
