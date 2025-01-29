import Image from 'next/image'

import { WeekStatus } from '@stardust/core/profile/structs'

import { StreakIcon } from '../StreakIcon'
import { AnimatedWeekday } from './AnimatedWeekday'
import { WEEK_DAY_STATUS_ICONS } from './week-day-status-icons'

type StreakProps = {
  weekStatus: WeekStatus
  streakCount?: number
}

export function StreakBoard({ weekStatus, streakCount }: StreakProps) {
  return (
    <div className='flex flex-col items-center justify-center gap-4 rounded-md border border-gray-300 p-6'>
      <h4 className='text-gray-300'>Sequência de dias estudados</h4>

      <div className='grid grid-cols-7 gap-3'>
        {WeekStatus.DAYS.map((weekday, index) => {
          const status = weekStatus.statuses[index]
          if (status)
            return (
              <AnimatedWeekday key={weekday} index={index}>
                <strong className='uppercase text-gray-300'>{weekday}</strong>
                <Image
                  src={`/icons/${WEEK_DAY_STATUS_ICONS[status]}`}
                  width={24}
                  height={24}
                  alt=''
                />
              </AnimatedWeekday>
            )
        })}
      </div>

      {streakCount && (
        <div className='flex items-center justify-center gap-1'>
          <StreakIcon size={32} />
          <p className='text-center font-medium text-green-500'>
            {streakCount} {streakCount > 1 ? 'dias' : 'dia'} estudados seguidos
          </p>
        </div>
      )}
    </div>
  )
}
