'use client'

import { PageTransitionAnimation } from '../../../../../components/PageTransitionAnimation'
import { Header } from '../Header'
import { Quiz } from '../Quiz'
import { SecondsIncrementer } from '../SecondsCounter'
import { Theory } from '../Theory'

import { useLessonStar } from './useLessonStar'

import type { Star } from '@/@types/star'
import { useLessonStore } from '@/stores/lessonStore'

interface LayoutProps {
  star: Star
}

export function LessonStar({ star }: LayoutProps) {
  const { isTransitionVisible, scrollRef, leaveLesson } = useLessonStar(star)

  const currentStage = useLessonStore((store) => store.state.currentStage)

  return (
    <>
      <PageTransitionAnimation isVisible={isTransitionVisible} />
      {currentStage !== 'congratulations' && <SecondsIncrementer />}
      <main ref={scrollRef} className="relative overflow-x-hidden">
        {currentStage !== 'congratulations' && (
          <Header onLeaveLesson={leaveLesson} />
        )}

        {star && (
          <>
            {currentStage === 'theory' && (
              <Theory title={star.name} number={star.number} />
            )}
            {currentStage === 'quiz' && <Quiz leaveLesson={leaveLesson} />}
          </>
        )}
      </main>
    </>
  )
}
