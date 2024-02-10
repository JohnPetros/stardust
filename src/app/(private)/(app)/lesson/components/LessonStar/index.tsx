'use client'

import { PageTransitionAnimation } from '../../../../../components/PageTransitionAnimation'
import { LessonHeader } from '../LessonHeader'
import { Quiz } from '../Quiz'
import { Theory } from '../Theory'

import { useLessonStar } from './useLessonStar'

import type { Star } from '@/@types/Star'
import { useSecondsCounter } from '@/global/hooks/useSecondsCounter'
import { useLessonStore } from '@/stores/lessonStore'

type LayoutProps = {
  star: Star
}

export function LessonStar({ star }: LayoutProps) {
  const { isTransitionVisible, mdxComponents, scrollRef, leaveLesson } =
    useLessonStar(star)

  const currentStage = useLessonStore((store) => store.state.currentStage)

  useSecondsCounter(currentStage === 'quiz')

  return (
    <>
      <PageTransitionAnimation isVisible={isTransitionVisible} />
      <div ref={scrollRef} className="relative overflow-x-hidden">
        {currentStage !== 'rewards' && <LessonHeader />}

        {star && (
          <>
            {currentStage === 'theory' && mdxComponents.length > 0 && (
              <Theory
                title={star.name}
                number={star.number}
                mdxComponents={mdxComponents}
              />
            )}
            {currentStage === 'quiz' && <Quiz leaveLesson={leaveLesson} />}
          </>
        )}
      </div>
    </>
  )
}
