import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'

import { Button } from '@/app/components/Button'

import { Rocket } from '@/types/rocket'
import { getImage } from '@/utils/functions'
import { twMerge } from 'tailwind-merge'

import { Variants, motion } from 'framer-motion'

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
  addUserAcquiredRocket: (id: string) => void
}

export function Rocket({
  data: { id, name, price, image, isAcquired },
  addUserAcquiredRocket,
}: RocketProps) {
  const { user, updateUser } = useAuth()
  if (!user) return null

  const [isSelected, setIsSelected] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)

  const prestigeLevel = 2
  const rocketImage = getImage('rockets', image)
  const isBuyable = user?.coins >= price

  async function selectRocket() {
    try {
      setIsRequesting(true)
      await updateUser({ rocket_id: id })
    } catch (error) {
      console.error(error)
    } finally {
      setIsRequesting(false)
    }
  }

  async function buyRocket() {
    if (!isBuyable || !user) {
      setIsRequesting(false)
      // setIsModalOpen(true);
      return
    }

    const updatedCoins = user?.coins - price
    const updatedAcquiredRockets = user?.acquired_rockets + 1
    try {
      await Promise.all([
        updateUser({
          coins: updatedCoins,
          acquired_rockets: updatedAcquiredRockets,
        }),
        addUserAcquiredRocket(id),
        selectRocket(),
      ])

      // setModalType('earning');
      // setIsModalOpen(true);
    } catch (error) {
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
    setIsSelected(id === user.rocket_id)
  }, [user.rocket_id])

  return (
    <div
      style={{ backgroundImage: 'url("/images/space-background.png")' }}
      className={twMerge(
        'rounded-md p-6 bg-center bg-cover border',
        (!isAcquired && !isBuyable) && 'brightness-75',
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
            <span className="font-semibold text-gray-100 text-lg">{price}</span>
          </div>
        )}
      </header>

      <motion.div
        variants={rocketImageVariants}
        initial="down"
        animate={isSelected ? 'up' : 'down'}
        className="relative w-28 h-28 mx-auto my-6"
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
          className="bg-yellow-300 w-max py-1 px-3"
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
    </div>
  )
}
