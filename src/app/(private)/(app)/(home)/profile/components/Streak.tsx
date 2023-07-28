'use client'
import { useState } from 'react'

import { User } from '@/types/user'
import { WEEK_DAYS } from '@/utils/constants'

import Lottie from 'lottie-react'
import StreakIcon from '../../../../../../../public/animations/streak.json'
import Image from 'next/image'

const weekStatusIcons: { [key in string]: string } = {
  todo: 'placeholder-day.svg',
  done: 'success-day.svg',
  undone: 'fail-day.svg',
}

interface StreakProps {
  data: User
}

export function Streak({ data: { streak, week_status } }: StreakProps) {
  const [weekStatus, setWeekStatus] = useState(week_status)

  return (
    <div className="border border-gray-300 rounded-md p-6 flex flex-col items-center justify-center gap-4">
      <h4 className="text-gray-300">Sequência de dias estudados</h4>

      <div className="grid grid-cols-7 gap-3">
        {WEEK_DAYS.map((weekday, index) => (
          <div
            key={weekday}
            className="flex flex-col items-center justify-center gap-2"
          >
            <strong className="uppercase text-gray-300">
              {weekday}
            </strong>
            <Image
              src={`/icons/${weekStatusIcons[weekStatus[index]]}`}
              width={24}
              height={24}
              alt=""
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <Lottie animationData={StreakIcon} loop={false} style={{ width: 32 }} />
        <p className="text-green-500">{streak} estudados seguidos</p>
      </div>
    </div>
  )
}
