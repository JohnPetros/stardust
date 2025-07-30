'use client'

import type { ReactNode } from 'react'
import Image from 'next/image'

import { AnimatedContainer } from './AnimatedContainer'
import { AnimatedSpan } from './AnimatedSpan'
import { RewardAlertDialog } from './RewardAlertDialog'

import { Button } from '@/ui/global/widgets/components/Button'
import { useImage } from '@/ui/global/hooks/useImage'

import { useAchievementCard } from './useAchievementCard'

type AchievementCardProps = {
  id: string
  name: string
  icon: string
  description: string
  reward?: number
  isUnlocked?: boolean
  isRescuable?: boolean
  children?: ReactNode
}

export function AchievementCard({
  id,
  icon,
  name,
  description,
  reward = 0,
  isUnlocked = false,
  isRescuable = false,
  children: progress,
}: AchievementCardProps) {
  const { handleRescueButtonClick } = useAchievementCard(id, reward)
  const iconImage = useImage('achievements', icon)

  return (
    <AnimatedContainer>
      <div className='relative grid h-12 w-10 place-content-center'>
        {isUnlocked ? (
          <Image
            src={iconImage}
            className='skeleton'
            onLoadingComplete={(imgElement) => imgElement.classList.remove('skeleton')}
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
            achivementReward={reward}
            achivementImage={iconImage}
            onClose={handleRescueButtonClick}
          >
            <Button tabIndex={0} className='mt-1 h-8 w-32 text-sm md:ml-4'>
              <AnimatedSpan>Resgatar</AnimatedSpan>
            </Button>
          </RewardAlertDialog>
        ) : (
          <>
            <p className='text-xs text-gray-100'>{description}</p>
            {!isUnlocked && progress && progress}
          </>
        )}
      </div>
    </AnimatedContainer>
  )
}
