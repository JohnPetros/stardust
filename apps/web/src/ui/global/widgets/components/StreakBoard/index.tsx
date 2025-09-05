import Image from 'next/image'

import { WeekStatus } from '@stardust/core/profile/structures'

import { StreakIcon } from '../StreakIcon'
import { AnimatedWeekday } from './AnimatedWeekday'
import { WEEK_DAY_STATUS_ICONS } from './week-day-status-icons'
import { AnimatedBorder } from '../AnimatedBorder'

type StreakProps = {
  weekStatus: WeekStatus
  streakCount?: number
}

export function StreakBoard({ weekStatus, streakCount }: StreakProps) {
  return (
    <AnimatedBorder className='flex flex-col items-center justify-center gap-4 rounded-md p-6 w-full'>
      <h4 className='text-gray-300'>Sequência de dias estudados</h4>

      <div className='grid grid-cols-7 gap-3'>
        {WeekStatus.DAYS.map((weekday, index) => {
          const status = weekStatus.value[index]
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
          return null
        })}
      </div>

      {typeof streakCount === 'number' && (
        <div className='flex items-center justify-center gap-1'>
          <StreakIcon size={32} />
          <p className='text-center font-medium text-green-500'>
            {streakCount} {streakCount > 1 ? 'dias' : 'dia'} estudados seguidos
          </p>
        </div>
      )}
    </AnimatedBorder>
  )
}
