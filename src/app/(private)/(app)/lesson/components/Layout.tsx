'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { PageTransitionAnimation } from '../../../../components/PageTransitionAnimation'

import { End } from './End'
import { Header } from './Header'
import { Quiz } from './Quiz'
import SecondsIncrementer from './SecondsCounter'
import { Theory } from './Theory'

import type { Star } from '@/@types/star'
import { Alert, AlertRef } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'
import { useStar } from '@/hooks/useStar'
import { useLessonStore } from '@/stores/lessonStore'
import { formatSecondsToTime } from '@/utils/helpers'

interface LayoutProps {
  star: Star
}

export function Layout({ star }: LayoutProps) {
  const { starId } = useParams()
  const { nextStar, updateUserData } = useStar(String(starId))

  const {
    state: { currentStage, questions, incorrectAnswersAmount, secondsAmount },
    actions: { setTexts, setQuestions, resetState },
  } = useLessonStore()

  const [isTransitionVisible, setIsTransitionVisible] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const alertRef = useRef<AlertRef>(null)

  const [coins, setCoins] = useState(0)
  const [xp, setXp] = useState(0)
  const [time, setTime] = useState('')
  const [accurance, setAccurance] = useState('')

  const router = useRouter()

  function leaveLesson() {
    router.push('/')
  }

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (star) {
      setTexts(star.texts)
      setQuestions(star.questions)
      timer = setTimeout(() => setIsTransitionVisible(false), 1000)
    }

    return () => {
      resetState()
      clearTimeout(timer)
    }
  }, [star, resetState, setTexts, setQuestions])

  useEffect(() => {
    function getAccurance() {
      const accurance =
        ((questions.length - incorrectAnswersAmount) / questions.length) * 100
      return accurance === 0 ? '100%' : accurance.toFixed(1) + '%'
    }

    function getCoins() {
      if (!nextStar) return 0

      let maxCoins = nextStar.isUnlocked ? 5 : 10
      for (let i = 0; i < incorrectAnswersAmount; i++) {
        maxCoins -= nextStar.isUnlocked ? 1 : 2
      }
      return maxCoins
    }

    function getXp() {
      if (!nextStar) return 0

      let maxXp = nextStar.isUnlocked ? 10 : 20
      for (let i = 0; i < incorrectAnswersAmount; i++) {
        maxXp -= nextStar.isUnlocked ? 2 : 5
      }

      return maxXp
    }

    if (currentStage === 'end') {
      setXp(getXp())
      setCoins(getCoins())
      setAccurance(getAccurance())
      setTime(formatSecondsToTime(secondsAmount))
    }
  }, [
    currentStage,
    incorrectAnswersAmount,
    nextStar,
    questions.length,
    secondsAmount,
  ])

  return (
    <>
      <PageTransitionAnimation isVisible={isTransitionVisible} />
      <SecondsIncrementer />
      <main ref={scrollRef} className="relative overflow-x-hidden">
        {currentStage !== 'end' && (
          <Header onLeaveLesson={() => alertRef.current?.open()} />
        )}

        {star && nextStar && (
          <>
            {currentStage === 'theory' && (
              <Theory title={star.name} number={star.number} />
            )}
            {currentStage === 'quiz' && <Quiz leaveLesson={leaveLesson} />}
            {currentStage === 'end' && (
              <End
                coins={coins}
                xp={xp}
                time={time}
                accurance={accurance}
                userDataUpdater={updateUserData}
                onExit={leaveLesson}
              />
            )}
          </>
        )}
      </main>

      <Alert
        ref={alertRef}
        type="crying"
        title="Deseja mesmo sair da sua lição?"
        canPlaySong={false}
        body={null}
        action={
          <Button
            className="w-32 bg-red-700 text-gray-100"
            onClick={leaveLesson}
          >
            Sair
          </Button>
        }
        cancel={
          <Button className="w-32 bg-green-400 text-green-900" autoFocus>
            Cancelar
          </Button>
        }
      />
    </>
  )
}
