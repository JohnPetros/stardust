'use client'
import { useEffect, useRef } from 'react'
import { useLesson } from '@/hooks/useLesson'
import { useAuth } from '@/hooks/useAuth'

import { Metric } from './Metric'

import ApolloContratulating from '../../../../../../../public/animations/apollo-congratulating.json'
import Lottie from 'lottie-react'

interface EndProps {
  isAlreadyCompleted: boolean
}

export function End({ isAlreadyCompleted }: EndProps) {
  const { user, updateUser } = useAuth()
  const {
    state: { questions, incorrectAnswersAmount, secondsAmount },
    dispatch,
  } = useLesson()

  const coins = useRef(0)
  const xp = useRef(0)
  const time = useRef('')
  const accurance = useRef('')

  function formatSecondsToTime(seconds: number) {
    const date = new Date(0);
    date.setSeconds(seconds);
    const time = date.toISOString().substring(14, 19);
    return time;
  }

  function getAccurance() {
    const accurance =
      ((questions.length - incorrectAnswersAmount) / questions.length) * 100
    return accurance === 0 ? '100%' : accurance.toFixed(1) + '%'
  }

  function getCoins() {
    let maxCoins = isAlreadyCompleted ? 5 : 10
    for (let i = 0; i < incorrectAnswersAmount; i++) {
      maxCoins -= isAlreadyCompleted ? 1 : 2
    }
    return maxCoins
  }

  function getXp() {
    let maxXp = isAlreadyCompleted ? 10 : 20
    for (let i = 0; i < incorrectAnswersAmount; i++) {
      maxXp -= isAlreadyCompleted ? 2 : 5
    }
    return maxXp
  }

  useEffect(() => {
    xp.current = getXp()
    coins.current = getCoins()
    accurance.current = getAccurance()
    time.current = formatSecondsToTime(secondsAmount)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center mt-24 mx-auto px-6 w-full max-w-lg">
      <h3 className="text-gray-100 text-xl font-semibold">Fase completada!</h3>

      <Lottie
        animationData={ApolloContratulating}
        style={{ width: 320 }}
        loop={true}
      />

      <div className="flex flex-col items-center justify-center mt-3">
        <div className="mx-auto">
          <Metric
            title="Poeira estelar"
            amount={coins.current}
            color="yellow"
            icon="coin.svg"
            isLarge={true}
            delay={1.4}
          />
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <Metric
            title="Total de xp"
            amount={xp.current}
            color="green"
            icon="xp.svg"
            isLarge={false}
            delay={2.4}
          />

          <Metric
            title="Tempo"
            amount={secondsAmount}
            color="blue"
            icon="clock.svg"
            isLarge={false}
            delay={3.4}
          />

          <Metric
            title="Acertos"
            amount={accurance.current}
            color="red"
            icon="percent.svg"
            isLarge={false}
            delay={4.4}
          />
        </div>
      </div>
    </div>
  )
}
