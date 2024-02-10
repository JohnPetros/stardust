'use client'

import { motion, Variants } from 'framer-motion'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

import { ShopButton } from '../../ShopButton'

import { useRocketItem } from './useRocketItem'

import type { Rocket } from '@/@types/Rocket'

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

export type RocketProps = {
  data: Rocket
  addUserAcquiredRocket: (RocketId: string) => void
}

export function RocketItem({ data, addUserAcquiredRocket }: RocketProps) {
  const {
    isBuyable,
    isSelected,
    rocketImage,
    handleShopButton,
    handleShopSuccess,
  } = useRocketItem({
    data,
    addUserAcquiredRocket,
  })

  return (
    <motion.div
      variants={rocketVariants}
      initial="hidden"
      animate="visible"
      style={{ backgroundImage: 'url("/images/space.png")' }}
      className={twMerge(
        ' rounded-md border-2 bg-cover bg-center p-6',
        !data.isAcquired && !isBuyable && 'brightness-75',
        isSelected && 'border-yellow-300'
      )}
    >
      <header className="flex justify-between">
        <div className="flex flex-col">
          <strong className=" gap-1 text-lg font-semibold text-gray-100">
            {data.name}
          </strong>
          <span className="h-1 w-full rounded bg-yellow-300"></span>
        </div>

        {!data.isAcquired && data.price > 0 && (
          <div className="flex items-center gap-2">
            <Image src="/icons/coin.svg" width={24} height={24} alt="" />
            <span className="text-lg font-semibold text-gray-100">
              {data.price}
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
          alt={data.name}
        />
      </motion.div>

      <footer className="flex items-center justify-between">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => {
            const isFilled = index + 1 <= 2
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
          isAcquired={data.isAcquired ?? false}
          isBuyable={isBuyable}
          isSelected={isSelected}
          shopHandler={handleShopButton}
          product={{ image: rocketImage, name: data.name }}
          onSuccess={handleShopSuccess}
        />
      </footer>
    </motion.div>
  )
}
