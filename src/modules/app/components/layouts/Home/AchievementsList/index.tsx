'use client'

import { twMerge } from 'tailwind-merge'

import { useAuthContext } from '@/modules/global/contexts/AuthContext'
import { PopoverMenu } from '@/modules/global/components/shared/PopoverMenu'
import { Search } from '@/modules/global/components/shared/Search'
import { Loading } from '@/modules/global/components/shared/Loading'
import { AchievementCard } from '../../../shared/AchievementCard'

import { useAchievementsList } from './useAchievementsList'
import { Icon } from '@/modules/global/components/shared/Icon'
import { AchievementProgress } from '../../../shared/AchievementProgress'

export function AchievementsList() {
  const { user } = useAuthContext()
  const { achievementsCollection, isLoading, popoverMenuButtons, handleSearchChange } =
    useAchievementsList()

  if (user)
    return (
      <div
        className={twMerge(
          'flex flex-shrink-0 flex-col gap-6 p-6',
          isLoading ? 'h-full items-center justify-center' : 'pb-32'
        )}
      >
        {!isLoading ? (
          <>
            <Search
              id='search-achivements'
              name='search-achivements'
              placeholder='pesquisar conquista'
              onSearchChange={handleSearchChange}
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
              {achievementsCollection?.achievements?.map((achievement) => (
                <li key={achievement.id}>
                  <AchievementCard
                    id={achievement.id}
                    name={achievement.name.value}
                    description={achievement.description}
                    requiredCount={achievement.requiredCount.value}
                    icon={achievement.icon.value}
                    reward={achievement.reward.value}
                    isUnlocked={user.hasUnlockedAchievement(achievement.id)}
                    isRescuable={user.hasRescuableAchievement(achievement.id)}
                  >
                    <AchievementProgress
                      metric={achievement.metric.value}
                      requiredCount={achievement.requiredCount.value}
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
