'use client'
import { useAuth } from '@/hooks/useAuth'

import { Metric } from './Metric'

import ApolloContratulating from '../../../../../../../public/animations/apollo-congratulating.json'
import Lottie from 'lottie-react'

export function End() {
  const { user, updateUser } = useAuth()

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
            amount={300}
            color="yellow"
            icon="coin.svg"
            isLarge={true}
            delay={300}
          />
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <Metric
            title="Total de xp"
            amount={42}
            color="green"
            icon="xp.svg"
            isLarge={false}
            delay={300}
          />

          <Metric
            title="Tempo"
            amount={42}
            color="blue"
            icon="clock.svg"
            isLarge={false}
            delay={300}
          />

          <Metric
            title="Acertos"
            amount={42}
            color="red"
            icon="percent.svg"
            isLarge={false}
            delay={300}
          />
        </div>
      </div>
    </div>
  )
}
