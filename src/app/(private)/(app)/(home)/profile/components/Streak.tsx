'use client'

import Image from 'next/image'
import { StreakIcon } from '../../components/StreakIcon'

import { WEEK_DAYS } from '@/utils/constants'

const weekStatusIcons: { [key in string]: string } = {
  todo: 'placeholder-day.svg',
  done: 'success-day.svg',
  undone: 'fail-day.svg',
}

interface StreakProps {
  weekStatus: string[]
  streakAmount: number
}

export function StreakBoard({ weekStatus, streakAmount }: StreakProps) {
  return (
    <div className="border border-gray-300 rounded-md p-6 flex flex-col items-center justify-center gap-4">
      <h4 className="text-gray-300">
        Sequência de dias estudados (Cosmic Run)
      </h4>

      <div className="grid grid-cols-7 gap-3">
        {WEEK_DAYS.map((weekday, index) => (
          <div
            key={weekday}
            className="flex flex-col items-center justify-center gap-2"
          >
            <strong className="uppercase text-gray-300">{weekday}</strong>
            <Image
              src={`/icons/${weekStatusIcons[weekStatus[index]]}`}
              width={24}
              height={24}
              alt=""
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-1">
        <StreakIcon size={32} />
        <p className="text-green-500 font-medium">
          {streakAmount} {streakAmount > 1 ? 'dias' : 'dia'} estudados seguidos
        </p>
      </div>
    </div>
  )
}
