'use client'

import { Achievement as AchievementType } from '@/types/achievement'
import { getImage } from '@/utils/functions'
import Image from 'next/image'
import * as Progress from '@radix-ui/react-progress'

import Lock from '../../../../../../public/icons/lock.svg'

interface AchievementProps {
  data: AchievementType
  currentProgress: number
}

export function Achievement({
  data: { isUnlocked, name, description, icon, required_amount, isRescuable },
  currentProgress,
}: AchievementProps) {
  const iconImage = getImage('achievements', icon)

  const percentage = (currentProgress / required_amount) * 100
  const barWidth = percentage > 100 ? 100 : percentage
  const canRescue = isRescuable

  const formatedCurrentProgress =
    currentProgress >= required_amount ? required_amount : currentProgress

  return (
    <div className="grid grid-cols-[48px_1fr] gap-4 py-4 border-b border-green-500">
      <div className="relative w-16 h-16 grid place-content-center">
        {isUnlocked ? (
          <Image src={iconImage} fill alt="" />
        ) : (
          <Image src={Lock} fill alt="" />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <strong className="text-gray-100">{name}</strong>
        <p className="text-gray-100">{description}</p>
        {!isUnlocked && (
          <div className="flex w-full items-center gap-2">
            <Progress.Root value={barWidth} className="bg-gray-400 h-1 w-full">
              <Progress.Indicator
                className="bg-green-400"
                style={{ width: `${barWidth}%` }}
              />
            </Progress.Root>
            <span className="text-gray-100">
              {formatedCurrentProgress}/{required_amount}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
