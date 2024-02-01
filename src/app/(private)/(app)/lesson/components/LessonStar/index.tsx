'use client'

import { PageTransitionAnimation } from '../../../../../components/PageTransitionAnimation'
import { Header } from '../Header'
import { Quiz } from '../Quiz'
import { Theory } from '../Theory'

import { useLessonStar } from './useLessonStar'

import type { Star } from '@/@types/star'
import { useSecondsCounter } from '@/hooks/useSecondsCounter'
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
        {currentStage !== 'rewards' && <Header />}

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
