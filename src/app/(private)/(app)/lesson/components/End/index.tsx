'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import Lottie, { LottieRef } from 'lottie-react'

import ApolloContratulating from '../../../../../../../public/animations/apollo-congratulating.json'
import StarsChain from '../../../../../../../public/animations/stars-chain.json'
import { StreakIcon } from '../../../(home)/components/StreakIcon'

import { Metric } from './Metric'
import { Streak } from './Streak'

import type { User } from '@/@types/user'
import { Modal, ModalRef } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'
import { useAuth } from '@/contexts/AuthContext'
import { playSound } from '@/utils/functions'

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

export interface updateUserDataParam {
  newCoins: number
  newXp: number
  user: User
}

interface EndProps {
  coins: number
  xp: number
  time: string
  accurance: string
  userDataUpdater: ({}: updateUserDataParam) => Promise<Partial<User>>
  onExit: () => void
}

export function End({
  accurance,
  coins,
  time,
  xp,
  userDataUpdater,
  onExit,
}: EndProps) {
  const { user, updateUser } = useAuth()

  const [hasNewLevel, setHasNewLevel] = useState(false)
  const [isFirstClick, setIsFirstClick] = useState(true)
  const [isStreakVisible, setIsStreakVisible] = useState(false)
  const [isEndMessageVisible, setIsEndMessageVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const modalRef = useRef<ModalRef>(null)

  function getUpdatedLevel(updatedXp: number) {
    if (!user) return

    const hasNewLevel = updatedXp >= 50 * (user.level - 1) + 25

    if (hasNewLevel) {
      const newLevel = user.level + 1
      setHasNewLevel(hasNewLevel)

      return newLevel
    }

    return user.level
  }

  async function getUpdatedUserData() {
    if (!user) return
    return await userDataUpdater({ newCoins: coins, newXp: xp, user })
  }

  const starsChainRef = useRef(null) as LottieRef

  async function updateUserData() {
    const updatedUserData = await getUpdatedUserData()

    if (updatedUserData) {
      const updatedLevel = updatedUserData.xp
        ? getUpdatedLevel(updatedUserData.xp)
        : user?.level

      const data = { ...updatedUserData, level: updatedLevel }

      const error = await updateUser(data)
    }
  }

  function pauseStarsAnimation() {
    const totalStars = (parseInt(accurance) * 5) / 100

    starsChainRef.current?.goToAndPlay(0)

    const delay = 500 * (!isNaN(totalStars) ? totalStars : 5)

    setTimeout(() => {
      starsChainRef.current?.pause()
    }, delay)
  }

  function handleFirstButtonClick() {
    if (!user) return

    const todayIndex = new Date().getDay()
    const todayStatus = user.week_status[todayIndex]

    setIsFirstClick(false)

    if (hasNewLevel) {
      modalRef.current?.open()
    }

    const isStreakVisible = todayStatus === 'todo'

    if (isStreakVisible) {
      setIsStreakVisible(true)
      return
    }

    setIsEndMessageVisible(true)
  }

  function handleSecondButtonClick() {
    setIsLoading(true)
    onExit()
  }

  useEffect(() => {
    pauseStarsAnimation()

    playSound('earning.wav')

    const time = setTimeout(async () => {
      await updateUserData()
    }, 250)

    return () => clearTimeout(time)
  }, [])

  return (
    <div className="mx-auto flex h-screen w-full max-w-lg flex-col items-center justify-center px-6">
      <div className="my-auto flex flex-col items-center justify-center">
        {!isStreakVisible && !isEndMessageVisible && (
          <>
            <h3 className="text-xl font-semibold text-gray-100">
              Fase completada!
            </h3>
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
            <Streak />
          </>
        )}

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

      <Modal
        ref={modalRef}
        type={'earning'}
        title={'Parabéns! Você alcançou um novo nível!'}
        body={
          <div className="mb-6 space-y-1 text-center text-gray-100">
            <p>
              Você acaba de chegar no{' '}
              <span className="text-medium text-lg text-green-400">
                Nível {user?.level} 😀
              </span>
              .
            </p>
            <p>Continue assim!</p>
          </div>
        }
        footer={
          <Button onClick={() => modalRef.current?.close()}>Show!</Button>
        }
      />
    </div>
  )
}
