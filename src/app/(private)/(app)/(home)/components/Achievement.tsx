'use client'

import { useEffect, useState } from 'react'
import * as Progress from '@radix-ui/react-progress'
import { motion, Variants } from 'framer-motion'
import Image from 'next/image'

import type { Achievement as AchievementType } from '@/@types/achievement'
import { Button } from '@/app/components/Button'
import { useAchivements } from '@/contexts/AchievementsContext'
import { getImage } from '@/utils/functions'

const achievementAnimations: Variants = {
  hidden: {
    x: -120,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      duration: 0.2,
    },
  },
}

const rescueButtonAnimations: Variants = {
  bounce: {
    scale: [1, 1.1, 1],
    transition: {
      repeat: Infinity,
      duration: 0.8,
    },
  },
}

type Status = {
  formatedCurrentProgress: number
  barWidth: number
  canRescue: boolean
}

interface AchievementProps {
  data: AchievementType
  isUnlocked: boolean
  isRescuable: boolean
}

export function Achievement({
  data: {
    id,
    name,
    description,
    icon,
    required_amount,
    currentProgress,
    reward,
  },
  isUnlocked,
  isRescuable,
}: AchievementProps) {
  const iconImage = getImage('achievements', icon)
  const [status, setStatus] = useState<Status | null>(null)
  // const [isLoading, setIsLoading] = useState(false)

  const { rescueAchivement } = useAchivements()

  function handleRescuButtonClick() {
    rescueAchivement({
      id,
      name,
      reward,
      image: iconImage,
    })
  }

  useEffect(() => {
    if (currentProgress || currentProgress === 0) {
      const percentage = (currentProgress / required_amount) * 100
      const barWidth = percentage > 100 ? 100 : percentage
      const canRescue = isRescuable

      const formatedCurrentProgress =
        currentProgress && currentProgress >= required_amount
          ? required_amount
          : currentProgress

      setStatus({ barWidth, canRescue, formatedCurrentProgress })
    }
  }, [currentProgress, isRescuable, required_amount])

  return (
    <motion.div
      variants={achievementAnimations}
      className="grid grid-cols-[48px_1fr] gap-4 border-b border-green-500 py-4"
    >
      <div className="relative grid h-12 w-12 place-content-center">
        {isUnlocked ? (
          <Image
            src={iconImage}
            className="skeleton"
            onLoadingComplete={(image) => image.classList.remove('skeleton')}
            fill
            alt=""
          />
        ) : (
          <Image src="/icons/lock.svg" fill alt="" />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <strong className="text-sm text-gray-100">{name}</strong>
        {isRescuable ? (
          <motion.div variants={rescueButtonAnimations} animate="bounce">
            <Button
              className="mt-1 h-8 w-32 text-sm md:ml-4"
              onClick={handleRescuButtonClick}
              // isLoading={isLoading}
              // isDisabled={isLoading}
            >
              Resgatar
            </Button>
          </motion.div>
        ) : (
          <>
            <p className="text-xs text-gray-100">{description}</p>
            {!isUnlocked && (
              <div className="flex w-full items-center gap-2">
                <Progress.Root
                  value={status?.barWidth}
                  className="h-1 w-full bg-gray-400"
                >
                  <Progress.Indicator
                    className="bg-green-400"
                    style={{ width: `${status?.barWidth}%` }}
                  />
                </Progress.Root>
                <span className="text-sm text-gray-100">
                  {status?.formatedCurrentProgress}/{required_amount}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}
