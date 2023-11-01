'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { TransitionPageAnimation } from '../../../../components/PageTransitionAnimation'
import { End } from '../components/End'
import { Header } from '../components/Header'
import { Quiz } from '../components/Quiz'
import { Theory } from '../components/Theory'

import { Modal, ModalRef } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'
import { useLesson } from '@/hooks/useLesson'
import { useStar } from '@/hooks/useStar'
import { formatSecondsToTime } from '@/utils/helpers'

export default function Lesson() {
  const { starId } = useParams()
  const { star, nextStar, updateUserData } = useStar(String(starId))

  const {
    state: { currentStage, questions, incorrectAnswersAmount, secondsAmount },
    dispatch,
  } = useLesson()

  const [isTransitionVisible, setIsTransitionVisible] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<ModalRef>(null)

  const [coins, setCoins] = useState(0)
  const [xp, setXp] = useState(0)
  const [time, setTime] = useState('')
  const [accurance, setAccurance] = useState('')

  const router = useRouter()

  function leaveLesson() {
    router.push('/')
  }

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

  useEffect(() => {
    setTimeout(() => dispatch({ type: 'incrementSecondsAmount' }), 1000)
  }, [secondsAmount])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (star) {
      dispatch({ type: 'setTexts', payload: star.texts })
      dispatch({ type: 'setQuestions', payload: star.questions })
      timer = setTimeout(() => setIsTransitionVisible(false), 1000)
    }

    return () => {
      dispatch({ type: 'resetState' })
      clearTimeout(timer)
    }
  }, [star])

  useEffect(() => {
    if (currentStage === 'end') {
      setXp(getXp())
      setCoins(getCoins())
      setAccurance(getAccurance())
      setTime(formatSecondsToTime(secondsAmount))
    }
  }, [currentStage])

  return (
    <>
      <TransitionPageAnimation isVisible={isTransitionVisible} />
      <main ref={scrollRef} className="relative overflow-x-hidden">
        {currentStage !== 'end' && (
          <Header onLeaveLesson={() => modalRef.current?.open()} />
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

      <Modal
        ref={modalRef}
        type="crying"
        title="Deseja mesmo sair da sua lição?"
        canPlaySong={false}
        body={null}
        footer={
          <div className="mt-3 flex items-center justify-center gap-2">
            <Button
              className="w-32 bg-green-400 text-green-900"
              onClick={() => modalRef.current?.close()}
              autoFocus
            >
              Cancelar
            </Button>
            <Button
              className="w-32 bg-red-700 text-gray-100"
              onClick={leaveLesson}
            >
              Sair
            </Button>
          </div>
        }
      />
    </>
  )
}
