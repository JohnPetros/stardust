'use client'

import { useLesson } from '@/hooks/useLesson'
import { useAuth } from '@/hooks/useAuth'
import { useRocket } from '@/hooks/useRocket'

import Image from 'next/image'
import { X } from '@phosphor-icons/react'

import { getImage } from '@/utils/functions'
import { ProgressBar } from '@/app/components/ProgressBar'

export function Header() {
  const { user } = useAuth()
  const {
    state: {
      texts,
      questions,
      currentQuestionIndex,
      renderedTextsAmount,
      livesAmount,
    },
    dispatch,
  } = useLesson()
  const { rocket } = useRocket(user?.rocket_id)
  const rocketImage = rocket ? getImage('rockets', rocket.image) : ''

  const total = texts.length + questions.length
  const currentProgressValue =
    (((renderedTextsAmount / texts.length) * total) / 2) * total +
    (((currentQuestionIndex / questions.length) * total) / 2) * total

  return (
    <header className="fixed z-10 top-0 py-3 w-full bg-gray-900">
      <div className="flex items-center justify-between gap-6 max-w-3xl mx-auto">
        <button>
          <X className="text-red-700 text-2xl" weight="bold" />
        </button>

        <ProgressBar
          value={currentProgressValue}
          height={16}
          indicatorImage={rocketImage}
        />

        <div className="flex items-center gap-2">
          <Image src="/icons/life.svg" width={36} height={36} alt="" />
          <span className="text-red-700 text-lg font-bold">{livesAmount}</span>
        </div>
      </div>
    </header>
  )
}
