'use client'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

import { motion, Variants } from 'framer-motion'

import { Metric } from './Metric'

import ApolloContratulating from '../../../../../../../public/animations/apollo-congratulating.json'
import StarsChain from '../../../../../../../public/animations/stars-chain.json'
import Lottie, { LottieRef } from 'lottie-react'

const apolloAnimations: Variants = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: .6,
    },
  },
}

interface EndProps {
  coins: number
  xp: number
  time: string
  accurance: string
}

export function End({ accurance, coins, time, xp }: EndProps) {
  const { user, updateUser } = useAuth()

  const starsChainRef = useRef(null) as LottieRef

  function pauseStarsAnimation() {
    const totalStars = (parseInt(accurance) * 5) / 100

    starsChainRef.current?.goToAndPlay(0)

    const delay = 500 * (!isNaN(totalStars) ? totalStars : 5)

    setTimeout(() => {
      starsChainRef.current?.pause()
    }, delay)
  }

  useEffect(() => {
    pauseStarsAnimation()
  }, [accurance])

  return (
    <div className="flex flex-col items-center justify-center mt-16 mx-auto px-6 w-full max-w-lg">
      <h3 className="text-gray-100 text-xl font-semibold">Fase completada!</h3>

      <Lottie
        lottieRef={starsChainRef}
        animationData={StarsChain}
        style={{ width: 180 }}
        loop={false}
        autoplay={true}
      />

      <motion.div
        variants={apolloAnimations}
        initial="hidden"
        animate="visible"
      >
        <Lottie
          animationData={ApolloContratulating}
          style={{ width: 320 }}
          loop={true}
        />
      </motion.div>

      <dl className="flex flex-col items-center justify-center mt-3">
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
      </dl>
    </div>
  )
}
