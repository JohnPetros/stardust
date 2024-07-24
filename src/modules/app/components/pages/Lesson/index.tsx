'use client'

import type { TextBlockDTO, QuestionDTO } from '@/@core/dtos'
import { PageTransitionAnimation } from '@/modules/global/components/shared/PageTransitionAnimation'
import { useLessonPage } from './useLessonPage'
import { useLessonStore } from '@/infra/stores/LessonStore'
import { LessonHeader } from './LessonHeader'
import { TheoryStage } from './TheoryStage'
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
  starName,
  starNumber,
  questionsDTO,
  textsBlocksDTO,
}: LessonPageProps) {
  const { scrollRef, stage, isTransitionVisible, handleLeavePage } = useLessonPage(
    questionsDTO,
    textsBlocksDTO
  )

  return (
    <>
      <PageTransitionAnimation isVisible={isTransitionVisible} />
      <div ref={scrollRef} className='relative overflow-x-hidden'>
        {stage !== 'rewards' && <LessonHeader onLeavePage={handleLeavePage} />}

        <main>
          {stage === 'theory' && <TheoryStage title={starName} number={starNumber} />}
          {/* {currentStage === 'quiz' && <Quiz leaveLesson={handleLeavePage} />} */}
        </main>
      </div>
    </>
  )
}
