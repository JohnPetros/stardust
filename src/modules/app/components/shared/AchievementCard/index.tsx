'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'

import { AnimatedContainer } from './AnimatedContainer'
import { AnimatedButton } from './AnimatedButton'
import { RewardAlertDialog } from './RewardAlertDialog'

import { Button } from '@/modules/global/components/shared/Button'
import { useApi } from '@/infra/api'

import { useAchievementCard } from './useAchievementCard'

type AchievementCardProps = {
  id: string
  name: string
  icon: string
  description: string
  requiredCount: number
  reward: number
  isUnlocked: boolean
  isRescuable: boolean
  children?: ReactNode
}

export function AchievementCard({
  id,
  icon,
  name,
  description,
  reward,
  isUnlocked,
  isRescuable,
  children: progress,
}: AchievementCardProps) {
  const { handleRescuButtonClick, handleRescuedAchievementsAlertDialogClose } =
    useAchievementCard(id, reward)

  const api = useApi()
  const iconImage = api.fetchImage('achievements', icon)

  return (
    <AnimatedContainer>
      <div className='relative grid h-12 w-12 place-content-center'>
        {isUnlocked ? (
          <Image
            src={iconImage}
            className='skeleton'
            onLoadingComplete={(image) => image.classList.remove('skeleton')}
            fill
            alt='Conquista desbloqueada'
          />
        ) : (
          <Image src='/icons/lock.svg' fill alt='Conquista bloqueada' />
        )}
      </div>
      <div className='flex flex-col gap-1'>
        <strong className='text-sm text-gray-100 font-semibold'>{name}</strong>
        {isRescuable ? (
          <RewardAlertDialog
            achivementName={name}
            achivementImage={icon}
            achivementReward={reward}
            onClose={() => handleRescuedAchievementsAlertDialogClose(id)}
          >
            <AnimatedButton>
              <Button
                tabIndex={0}
                className='mt-1 h-8 w-32 text-sm md:ml-4'
                onClick={handleRescuButtonClick}
              >
                Resgatar
              </Button>
            </AnimatedButton>
          </RewardAlertDialog>
        ) : (
          <>
            <p className='text-xs text-gray-100'>{description}</p>
            {progress && progress}
          </>
        )}
      </div>
    </AnimatedContainer>
  )
}