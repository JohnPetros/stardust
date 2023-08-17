'use client'

import { useEffect, useState } from 'react'
import { useAchivementsContext } from '@/hooks/useAchievementContext'

import Image from 'next/image'
import * as Progress from '@radix-ui/react-progress'
import { Button } from '@/app/components/Button'

import { Variants, motion } from 'framer-motion'
import { getImage } from '@/utils/functions'

import type { Achievement as AchievementType } from '@/types/achievement'

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
  const [isLoading, setIsLoading] = useState(false)

  const { rescueAchivement } = useAchivementsContext()

  function handleRescuButtonClick() {
    rescueAchivement(id, name, reward)
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
  }, [])

  return (
    <motion.div
      variants={achievementAnimations}
      className="grid grid-cols-[48px_1fr] gap-4 py-4 border-b border-green-500"
    >
      <div className="relative w-12 h-12 grid place-content-center">
        {isUnlocked ? (
          <Image src={iconImage} fill alt="" />
        ) : (
          <Image src="/icons/lock.svg" fill alt="" />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <strong className="text-gray-100 text-sm">{name}</strong>
        {isRescuable ? (
          <motion.div variants={rescueButtonAnimations} animate="bounce">
            <Button
              className="h-8 w-32 ml-4 text-sm"
              onClick={handleRescuButtonClick}
              // isLoading={isLoading}
              // isDisabled={isLoading}
            >
              Resgatar
            </Button>
          </motion.div>
        ) : (
          <>
            <p className="text-gray-100 text-xs">{description}</p>
            {!isUnlocked && (
              <div className="flex w-full items-center gap-2">
                <Progress.Root
                  value={status?.barWidth}
                  className="bg-gray-400 h-1 w-full"
                >
                  <Progress.Indicator
                    className="bg-green-400"
                    style={{ width: `${status?.barWidth}%` }}
                  />
                </Progress.Root>
                <span className="text-gray-100 text-sm">
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
