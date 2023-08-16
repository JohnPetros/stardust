'use client'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useSWRConfig } from 'swr'
import Image from 'next/image'

import { Button } from '@/app/components/Button'

import { Rocket } from '@/types/rocket'
import { getImage, playSound } from '@/utils/functions'
import { twMerge } from 'tailwind-merge'

import { Variants, motion } from 'framer-motion'
import { Modal, ModalRef } from '@/app/components/Modal'

import RewardLight from '../../../../../../../public/animations/reward-shinning.json'

import Lottie from 'lottie-react'
import { ToastRef } from '@/app/components/Toast'

const rocketVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
}

const rocketImageVariants: Variants = {
  down: {
    y: 0,
  },
  up: {
    y: -16,
    transition: {
      repeat: Infinity,
      repeatType: 'mirror',
      duration: 1.5,
    },
  },
}

interface RocketProps {
  data: Rocket
  addUserAcquiredRocket: (RocketId: string) => void
}

export function Rocket({
  data: { id, name, price, image, isAcquired },
  addUserAcquiredRocket,
}: RocketProps) {
  const { user, updateUser } = useAuth()

  const { mutate } = useSWRConfig()

  const [isSelected, setIsSelected] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)

  const denyingModalRef = useRef<ModalRef>(null)
  const earningModalRef = useRef<ModalRef>(null)
  const toastRef = useRef<ToastRef>(null)

  const prestigeLevel = 2
  const rocketImage = getImage('rockets', image)
  const isBuyable = user ? (user?.coins >= price) : false

  async function selectRocket() {
    try {
      setIsRequesting(true)
      await updateUser({ rocket_id: id })
      mutate('/rocket?id=' + id, { id, name, image })

      playSound('switch.wav')
    } catch (error) {
      console.error(error)
      toastRef.current?.open({
        type: 'error',
        message: 'Erro ao tentar selecionar o foguete ' + name,
      })
    } finally {
      setIsRequesting(false)
    }
  }

  async function buyRocket() {
    if (!isBuyable || !user) {
      setIsRequesting(false)
      denyingModalRef.current?.open()
      return
    }

    const updatedCoins = user?.coins - price
    const updatedAcquiredRockets = user?.acquired_rockets + 1
    earningModalRef.current?.open()

    try {
      await Promise.all([
        updateUser({
          coins: updatedCoins,
          acquired_rockets: updatedAcquiredRockets,
        }),
        addUserAcquiredRocket(id),
        selectRocket(),
      ])
    } catch (error) {
      toastRef.current?.open({
        type: 'error',
        message: 'Erro ao tentar comprar o foguete ' + name,
      })
      console.error(error)
    } finally {
      setIsRequesting(false)
    }
  }

  async function handleButtonPress() {
    setIsRequesting(true)

    if (isAcquired) {
      await selectRocket()
      return
    }

    buyRocket()
  }

  useEffect(() => {
    if (user) setIsSelected(id === user.rocket_id)
  }, [user?.rocket_id])

  return (
    <>
      <motion.div
        variants={rocketVariants}
        initial="hidden"
        animate="visible"
        style={{ backgroundImage: 'url("/images/space-background.png")' }}
        className={twMerge(
          'rounded-md p-6 bg-center bg-cover border-2 max-w-lg',
          !isAcquired && !isBuyable && 'brightness-75',
          isSelected && 'border-yellow-300'
        )}
      >
        <header className="flex justify-between">
          <div className="flex flex-col">
            <strong className=" font-semibold text-gray-100 text-lg gap-1">
              {name}
            </strong>
            <span className="w-full h-1 bg-yellow-300 rounded"></span>
          </div>

          {!isAcquired && price > 0 && (
            <div className="flex items-center gap-2">
              <Image src="/icons/coin.svg" width={24} height={24} alt="" />
              <span className="font-semibold text-gray-100 text-lg">
                {price}
              </span>
            </div>
          )}
        </header>

        <motion.div
          variants={rocketImageVariants}
          initial="down"
          animate={isSelected ? 'up' : 'down'}
          className="relative w-28 h-28 mx-auto my-8"
        >
          <Image src={rocketImage} fill alt={name} />
        </motion.div>

        <footer className="flex items-center justify-between">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => {
              const isFilled = index + 1 <= prestigeLevel

              return (
                <>
                  {isFilled ? (
                    <Image
                      src="/icons/filled-star.svg"
                      width={18}
                      height={18}
                      alt=""
                    />
                  ) : (
                    <Image
                      src="/icons/empty-star.svg"
                      width={18}
                      height={18}
                      alt=""
                    />
                  )}
                </>
              )
            })}
          </div>

          <Button
            className="bg-yellow-300 w-max py-1 px-3 h-8"
            onClick={handleButtonPress}
            isLoading={isRequesting}
          >
            {isSelected && isAcquired
              ? 'Selecionado'
              : isAcquired
              ? 'Selecionar'
              : 'Comprar'}
          </Button>
        </footer>
      </motion.div>

      <Modal
        ref={denyingModalRef}
        type="denying"
        title="Parece que você não tem poeira estelar o suficiente"
        body={
          <p className="text-gray-100 font-medium text-sm text-center my-6 px-6">
            Mas você pode adquirir mais completando estrelas ou resolvendo
            desafios.
          </p>
        }
        footer={
          <Button onClick={denyingModalRef.current?.close}>Entendido</Button>
        }
      />

      <Modal
        ref={earningModalRef}
        type="earning"
        title="Parabéns, você acabou de adquiriu um novo foguete!"
        body={
          <div className="relative flex flex-col items-center justify-center">
            <span className="absolute -top-2 left-25">
              <Lottie
                animationData={RewardLight}
                loop={true}
                style={{ width: 180 }}
              />
            </span>
            <div className="relative w-24 h-24 mt-6">
              <Image src={rocketImage} fill alt={name} />
            </div>
            <strong className="text-gray-100 my-6">{name}</strong>
          </div>
        }
        footer={
          <Button onClick={earningModalRef.current?.close}>Entendido</Button>
        }
      />
    </>
  )
}
