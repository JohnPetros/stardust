'use client'

import type { AchievementMetricValue } from '@stardust/core/profile/types'
import { twMerge } from 'tailwind-merge'

import { Icon } from '@/ui/global/widgets/components/Icon'
import { Loading } from '@/ui/global/widgets/components/Loading'
import type { PopoverMenuButton } from '@/ui/global/widgets/components/PopoverMenu/types'
import { PopoverMenu } from '@/ui/global/widgets/components/PopoverMenu'
import { Search } from '@/ui/global/widgets/components/Search'
import { AchievementCard } from '../../../components/AchievementCard'
import { AchievementProgress } from '../../../components/AchievementProgress'

type AchievementsListViewProps = {
  isLoading: boolean
  achievements: Array<{
    id: string
    name: string
    description: string
    icon: string
    reward: number
    metric: AchievementMetricValue
    requiredCount: number
    isUnlocked: boolean
    isRescuable: boolean
  }>
  popoverMenuButtons: PopoverMenuButton[]
  onSearchChange: (value: string) => void
}

export function AchievementsListView({
  isLoading,
  achievements,
  popoverMenuButtons,
  onSearchChange,
}: AchievementsListViewProps) {
  return (
    <div
      className={twMerge(
        'flex flex-shrink-0 flex-col gap-6 p-6',
        isLoading ? 'h-full items-center justify-center' : 'pb-32',
      )}
    >
      {!isLoading ? (
        <>
          <Search
            id='search-achivements'
            name='search-achivements'
            placeholder='pesquisar conquista'
            onSearchChange={onSearchChange}
          />
          <div className='ml-auto w-max'>
            <PopoverMenu
              label='Abrir menu para ordernar lista de conquistas'
              buttons={popoverMenuButtons}
            >
              <button type='button'>
                <Icon name='arrow-up-down' size={18} className='text-gray-500' />
              </button>
            </PopoverMenu>
          </div>
          <ul className='-mt-8'>
            {achievements.map((achievement) => (
              <li key={achievement.id}>
                <AchievementCard
                  id={achievement.id}
                  name={achievement.name}
                  description={achievement.description}
                  icon={achievement.icon}
                  reward={achievement.reward}
                  isUnlocked={achievement.isUnlocked}
                  isRescuable={achievement.isRescuable}
                >
                  <AchievementProgress
                    metric={achievement.metric}
                    requiredCount={achievement.requiredCount}
                  />
                </AchievementCard>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <Loading />
      )}
    </div>
  )
}
