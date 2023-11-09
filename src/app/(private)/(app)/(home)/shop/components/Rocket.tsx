'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import Image from 'next/image'
import { useSWRConfig } from 'swr'
import { twMerge } from 'tailwind-merge'

import { ShopButton } from './ShopButton'

import { Rocket } from '@/@types/rocket'
import { ToastRef } from '@/app/components/Toast'
import { useAuth } from '@/contexts/AuthContext'
import { getImage, playSound } from '@/utils/helpers'

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

  const toastRef = useRef<ToastRef>(null)

  const prestigeLevel = 2
  const rocketImage = getImage('rockets', image)
  const isBuyable = user ? user?.coins >= price : false

  async function handleShopSuccess() {
    if (user) {
      const updatedCoins = user?.coins - price
      const updatedAcquiredRockets = user?.acquired_rockets + 1

      await Promise.all([
        updateUser({
          coins: updatedCoins,
          acquired_rockets: updatedAcquiredRockets,
        }),
        addUserAcquiredRocket(id),
      ])
    }
  }

  async function selectRocket() {
    try {
      await updateUser({ rocket_id: id })
      mutate('/rocket?id=' + id, { id, name, image })

      playSound('switch.wav')
    } catch (error) {
      toastRef.current?.open({
        type: 'error',
        message: 'Erro ao tentar selecionar o foguete ' + name,
      })
    }
  }

  async function buyRocket() {
    if (!isBuyable || !user) {
      return
    }

    try {
      await selectRocket()
    } catch (error) {
      toastRef.current?.open({
        type: 'error',
        message: 'Erro ao tentar comprar o foguete ' + name,
      })
      console.error(error)
    }
  }

  async function handleShopButton() {
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
        style={{ backgroundImage: 'url("/images/space.png")' }}
        className={twMerge(
          ' rounded-md border-2 bg-cover bg-center p-6',
          !isAcquired && !isBuyable && 'brightness-75',
          isSelected && 'border-yellow-300'
        )}
      >
        <header className="flex justify-between">
          <div className="flex flex-col">
            <strong className=" gap-1 text-lg font-semibold text-gray-100">
              {name}
            </strong>
            <span className="h-1 w-full rounded bg-yellow-300"></span>
          </div>

          {!isAcquired && price > 0 && (
            <div className="flex items-center gap-2">
              <Image src="/icons/coin.svg" width={24} height={24} alt="" />
              <span className="text-lg font-semibold text-gray-100">
                {price}
              </span>
            </div>
          )}
        </header>

        <motion.div
          variants={rocketImageVariants}
          initial="down"
          animate={isSelected ? 'up' : 'down'}
          className="relative mx-auto my-8 h-28 w-28"
        >
          <Image
            src={rocketImage}
            fill
            sizes="(min-width: 375px) 100vw"
            alt={name}
          />
        </motion.div>

        <footer className="flex items-center justify-between">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => {
              const isFilled = index + 1 <= prestigeLevel
              return (
                <span key={`star-${index}`}>
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
                </span>
              )
            })}
          </div>

          <ShopButton
            isAcquired={isAcquired}
            isBuyable={isBuyable}
            isSelected={isSelected}
            shopHandler={handleShopButton}
            product={{ image: rocketImage, name }}
            onSuccess={handleShopSuccess}
          />
        </footer>
      </motion.div>
    </>
  )
}
