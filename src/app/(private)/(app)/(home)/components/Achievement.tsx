'use client'

import { useEffect, useState } from 'react'
import * as Progress from '@radix-ui/react-progress'
import { motion, Variants } from 'framer-motion'
import Image from 'next/image'

import type { Achievement as AchievementType } from '@/@types/achievement'
import { Alert } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'
import { useAchivements } from '@/contexts/AchievementsContext'
import { getImage } from '@/utils/helpers'

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
  const { rescueAchivement, handleRescuedAchievementsAlertClose } =
    useAchivements()

  async function handleRescuButtonClick() {
    await rescueAchivement(id, reward)
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
      data-testid="achievement"
    >
      <div className="relative grid h-12 w-12 place-content-center">
        {isUnlocked ? (
          <Image
            src={iconImage}
            className="skeleton"
            onLoadingComplete={(image) => image.classList.remove('skeleton')}
            fill
            alt="Conquista desbloqueada"
          />
        ) : (
          <Image src="/icons/lock.svg" fill alt="Conquista bloqueada" />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <strong className="text-sm text-gray-100">{name}</strong>
        {isRescuable ? (
          <Alert
            type={'earning'}
            title={'Recompensa resgatada!'}
            body={
              <div className="flex flex-col items-center">
                <p className="text-center font-medium text-gray-100">
                  Parabéns! Você acabou de ganhar{' '}
                  <span className="text-lg font-semibold text-yellow-400">
                    {reward}
                  </span>{' '}
                  de poeira estela pela conquista:
                </p>
                <div className="mt-6 flex flex-col items-center justify-center">
                  <Image src={iconImage} width={72} height={72} alt="" />
                  <p className="mt-2 text-center font-semibold text-green-500">
                    {name}
                  </p>
                </div>
              </div>
            }
            action={
              <Button
                className="mt-6"
                onClick={() => handleRescuedAchievementsAlertClose(id)}
              >
                Entendido
              </Button>
            }
            onClose={() => handleRescuedAchievementsAlertClose(id)}
          >
            <motion.div
              variants={rescueButtonAnimations}
              animate="bounce"
              className="w-max"
            >
              <Button
                tabIndex={0}
                className="mt-1 h-8 w-32 text-sm md:ml-4"
                onClick={handleRescuButtonClick}
              >
                Resgatar
              </Button>
            </motion.div>
          </Alert>
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
