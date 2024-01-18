'use client'

import { PageTransitionAnimation } from '../../../../../components/PageTransitionAnimation'
import { Header } from '../Header'
import { Quiz } from '../Quiz'
import { SecondsCounter } from '../SecondsCounter'
import { Theory } from '../Theory'

import { useLessonStar } from './useLessonStar'

import type { Star } from '@/@types/star'
import { useLessonStore } from '@/stores/lessonStore'

interface LayoutProps {
  star: Star
  mdxComponets: string[]
}

export function LessonStar({ star, mdxComponets }: LayoutProps) {
  const { isTransitionVisible, secondsCounterRef, scrollRef, leaveLesson } =
    useLessonStar(star)

  const currentStage = useLessonStore((store) => store.state.currentStage)

  return (
    <>
      <PageTransitionAnimation isVisible={isTransitionVisible} />
      {currentStage !== 'rewards' && <SecondsCounter ref={secondsCounterRef} />}
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
