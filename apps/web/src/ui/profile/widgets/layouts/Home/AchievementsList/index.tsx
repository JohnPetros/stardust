'use client'

import { twMerge } from 'tailwind-merge'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { PopoverMenu } from '@/ui/global/widgets/components/PopoverMenu'
import { Search } from '@/ui/global/widgets/components/Search'
import { Loading } from '@/ui/global/widgets/components/Loading'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { AchievementCard } from '../../../components/AchievementCard'
import { AchievementProgress } from '../../../components/AchievementProgress'
import { useAchievementsList } from './useAchievementsList'

export function AchievementsList() {
  const { user } = useAuthContext()
  const { achievementsList, isLoading, popoverMenuButtons, handleSearchChange } =
    useAchievementsList()

  if (user)
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
              {achievementsList?.achievements?.map((achievement) => (
                <li key={achievement.id.value}>
                  <AchievementCard
                    id={achievement.id.value}
                    name={achievement.name.value}
                    description={achievement.description}
                    icon={achievement.icon.value}
                    reward={achievement.reward.value}
                    isUnlocked={user.hasUnlockedAchievement(achievement.id).isTrue}
                    isRescuable={user.hasRescuableAchievement(achievement.id).isTrue}
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
