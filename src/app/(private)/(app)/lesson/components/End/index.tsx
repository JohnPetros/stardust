'use client'
import { useEffect, useRef, useState } from 'react'
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
  const [coins, setCoins] = useState(0)
  const [xp, setXp] = useState(0)
  const [time, setTime] = useState('')
  const [accurance, setAccurance] = useState('')

  function formatSecondsToTime(seconds: number) {
    const date = new Date(0)
    date.setSeconds(seconds)
    const time = date.toISOString().substring(14, 19)

    console.log(time)

    return time
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
    setXp(getXp())
    setCoins(getCoins())
    setAccurance(getAccurance())
    setTime(formatSecondsToTime(secondsAmount))
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
            amount={coins}
            color="yellow"
            icon="coin.svg"
            isLarge={true}
            delay={1}
          />
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <Metric
            title="Total de xp"
            amount={xp}
            color="green"
            icon="xp.svg"
            isLarge={false}
            delay={1.5}
          />

          <Metric
            title="Tempo"
            amount={time}
            color="blue"
            icon="clock.svg"
            isLarge={false}
            delay={2}
          />

          <Metric
            title="Acertos"
            amount={accurance}
            color="red"
            icon="percent.svg"
            isLarge={false}
            delay={2.5}
          />
        </div>
      </div>
    </div>
  )
}
