'use client'

import { motion, Variants } from 'framer-motion'
import Image from 'next/image'

import { useAchievement } from './useAchievement'

import type { Achievement as AchievementType } from '@/@types/Achievement'
import { Alert } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'
import { ProgressBar } from '@/app/components/ProgressBar'

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

type AchievementProps = {
  data: AchievementType
  isUnlocked: boolean
  isRescuable: boolean
}

export function Achievement({
  data,
  isUnlocked,
  isRescuable,
}: AchievementProps) {
  const {
    status,
    iconImage,
    handleRescuButtonClick,
    handleRescuedAchievementsAlertClose,
  } = useAchievement(data)

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
        <strong className="text-sm text-gray-100">{data.name}</strong>
        {isRescuable ? (
          <Alert
            type={'earning'}
            title={'Recompensa resgatada!'}
            body={
              <div className="flex flex-col items-center">
                <p className="text-center font-medium text-gray-100">
                  Parabéns! Você acabou de ganhar{' '}
                  <span className="text-lg font-semibold text-yellow-400">
                    {data.reward}
                  </span>{' '}
                  de poeira estela pela conquista:
                </p>
                <div className="mt-6 flex flex-col items-center justify-center">
                  <Image src={iconImage} width={72} height={72} alt="" />
                  <p className="mt-2 text-center font-semibold text-green-500">
                    {data.name}
                  </p>
                </div>
              </div>
            }
            action={
              <Button
                className="mt-6"
                onClick={() => handleRescuedAchievementsAlertClose(data.id)}
              >
                Entendido
              </Button>
            }
            onOpenChange={(isOpen: boolean) =>
              !isOpen ? handleRescuedAchievementsAlertClose(data.id) : null
            }
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
            <p className="text-xs text-gray-100">{data.description}</p>
            {!isUnlocked && (
              <div className="flex w-full items-center gap-2 text-sm text-gray-100">
                <ProgressBar height={4} value={status?.barWidth ?? 0} />
                <span>
                  {status?.formatedCurrentProgress}/{data.requiredCount}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}
