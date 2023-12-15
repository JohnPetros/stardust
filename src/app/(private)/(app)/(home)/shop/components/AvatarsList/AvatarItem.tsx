'use client'
import { LockSimple } from '@phosphor-icons/react'
import { motion, Variants } from 'framer-motion'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

import { ShopButton } from '../ShopButton'

import { useAvatarItem } from './useAvatarItem'

import { Avatar } from '@/@types/avatar'

const avatarVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
}

export interface AvatarItemProps {
  data: Avatar
  addUserAcquiredAvatar: (AvatarId: string) => void
}

export function Avatar({
  data: { id, name, price, image, isAcquired },
  addUserAcquiredAvatar,
}: AvatarItemProps) {
  const {
    avatarImage,
    isBuyable,
    isSelected,
    handleShopButton,
    handleShopSuccess,
  } = useAvatarItem({
    data: { id, name, price, image, isAcquired },
    addUserAcquiredAvatar,
  })

  return (
    <motion.div
      variants={avatarVariants}
      initial="hidden"
      animate="visible"
      className={twMerge(
        'grid grid-cols-[1fr_1.4fr] overflow-hidden rounded-md border-2',
        isSelected ? 'border-yellow-300' : 'border-transparent',
        !isAcquired && !isBuyable ? 'brightness-75' : 'brightness-90'
      )}
    >
      <div className="flex flex-col justify-between bg-gray-800 p-6">
        <div className="flex flex-col gap-2">
          {!isAcquired && price > 0 && (
            <div className=" z-30 flex items-center gap-2">
              <Image src="/icons/coin.svg" width={24} height={24} alt="" />
              <strong className="text-lg font-semibold text-gray-100">
                {price}
              </strong>
            </div>
          )}
          <strong className="text-gray-100">{name}</strong>
        </div>

        <ShopButton
          isAcquired={isAcquired}
          isBuyable={isBuyable}
          isSelected={isSelected}
          shopHandler={handleShopButton}
          onSuccess={handleShopSuccess}
          product={{ image: avatarImage, name }}
        />
      </div>

      <div className="relative h-64">
        {!isAcquired && (
          <div className="absolute right-3 top-3 z-30">
            <LockSimple className="text-xl text-gray-800" weight="bold" />
          </div>
        )}

        <Image
          src={avatarImage}
          fill
          alt={name}
          className="skeleton object-cover"
          sizes="(min-width: 375px) 100vw"
          onLoadingComplete={(image) => image.classList.remove('skeleton')}
        />
      </div>
    </motion.div>
  )
}
