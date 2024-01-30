'use client'

import { PageTransitionAnimation } from '../../../../../components/PageTransitionAnimation'
import { Header } from '../Header'
import { Quiz } from '../Quiz'
import { Theory } from '../Theory'

import { useLessonStar } from './useLessonStar'

import type { Star } from '@/@types/star'
import { useSecondsCounter } from '@/hooks/useSecondsCounter'
import { useLessonStore } from '@/stores/lessonStore'

interface LayoutProps {
  star: Star
  mdxComponets: string[]
}

export function LessonStar({ star, mdxComponets }: LayoutProps) {
  const { isTransitionVisible, scrollRef, leaveLesson } = useLessonStar(star)

  const currentStage = useLessonStore((store) => store.state.currentStage)

  useSecondsCounter(currentStage === 'quiz')

  return (
    <>
      <PageTransitionAnimation isVisible={isTransitionVisible} />
      <div ref={scrollRef} className="relative overflow-x-hidden">
        {currentStage !== 'rewards' && <Header />}

        {star && (
          <>
            {currentStage === 'theory' && (
              <Theory
                title={star.name}
                number={star.number}
                compiledMdxComponets={mdxComponets}
              />
            )}
            {currentStage === 'quiz' && <Quiz leaveLesson={leaveLesson} />}
          </>
        )}
      </div>
    </>
  )
}
