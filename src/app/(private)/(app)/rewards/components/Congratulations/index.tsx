'use client'

import { motion, Variants } from 'framer-motion'
import Lottie from 'lottie-react'

import ApolloContratulating from '../../../../../../../public/animations/apollo-congratulating.json'
import StarsChain from '../../../../../../../public/animations/stars-chain.json'

import { Metric } from './Metric'
import { Streak } from './Streak'
import { useCongratulations } from './useCongratulations'

import { WeekStatus } from '@/@types/WeekStatus'
import { Alert } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'
import { StreakIcon } from '@/app/components/StreakIcon'

const apolloAnimations: Variants = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
    },
  },
}

const endMessageAnimations: Variants = {
  up: {
    opacity: 0,
    y: -32,
  },
  down: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
    },
  },
}

const buttonAnimations: Variants = {
  down: {
    opacity: 0,
    y: 32,
  },
  up: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 3,
      duration: 0.4,
    },
  },
}

export type CongratulationsProps = {
  coins: number
  xp: number
  time: string
  accurance: string
  todayStatus: WeekStatus
  updatedLevel: { hasNewLevel: boolean; level: number }
  nextRoute: string
}

export function Congratulations({
  accurance,
  coins,
  time,
  xp,
  todayStatus,
  updatedLevel,
  nextRoute,
}: CongratulationsProps) {
  const {
    handleFirstButtonClick,
    handleSecondButtonClick,
    isEndMessageVisible,
    isFirstClick,
    isLoading,
    isStreakVisible,
    alertRef,
  } = useCongratulations({
    accurance,
    coins,
    xp,
    todayStatus,
    updatedLevel,
    nextRoute,
  })

  return (
    <div className="mx-auto flex h-screen w-full max-w-lg flex-col items-center justify-center px-6">
      <div className="my-auto flex flex-col items-center justify-center">
        {!isStreakVisible && !isEndMessageVisible && (
          <>
            <h2 className="text-xl font-semibold text-gray-100">
              Fase completada!
            </h2>
            {/* TODO: Fix Stars Chain Lottie Bug */}
            {/* <Lottie
              animationData={StarsChain}
              style={{ width: 180 }}
              loop={false}
            /> */}
            <motion.div
              variants={apolloAnimations}
              initial="hidden"
              animate="visible"
            >
              <Lottie
                animationData={ApolloContratulating}
                style={{ width: 280 }}
                loop={true}
              />
            </motion.div>
            <dl className="mt-3 flex flex-col items-center justify-center">
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

              <div className="mt-6 grid grid-cols-3 gap-3">
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
          </>
        )}

        {isStreakVisible && (
          <>
            <StreakIcon size={220} />
          </>
        )}

        <Streak isVisible={isStreakVisible} />

        {isEndMessageVisible && (
          <motion.p
            variants={endMessageAnimations}
            initial="up"
            animate="down"
            className="text-center text-2xl font-semibold text-white"
          >
            Parabéns, continue assim 😉!
          </motion.p>
        )}
      </div>

      <motion.div
        variants={buttonAnimations}
        initial="down"
        animate="up"
        className="mb-16 w-80"
      >
        <Button
          isLoading={isLoading}
          onClick={
            isFirstClick ? handleFirstButtonClick : handleSecondButtonClick
          }
        >
          Continuar
        </Button>
      </motion.div>

      <Alert
        ref={alertRef}
        type="earning"
        title={'Parabéns! Você alcançou um novo nível!'}
        body={
          <div className="mb-6 space-y-1 text-center text-gray-100">
            <p>
              Você acaba de chegar no{' '}
              <span className="text-medium text-lg text-green-400">
                Nível {updatedLevel.level} 😀
              </span>
              .
            </p>
            <p>Continue assim!</p>
          </div>
        }
        action={<Button>Show!</Button>}
      />
    </div>
  )
}
