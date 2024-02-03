'use client'

import { ArrowsDownUp } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

import { Achievement } from '../Achievement'

import { useAchievementsList } from './useAchievementsList'

import { Loading } from '@/app/components/Loading'
import { PopoverMenu } from '@/app/components/PopoverMenu'
import { Search } from '@/app/components/Search'
import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'

export function AchievementsList() {
  const { user } = useAuthContext()
  const { isLoading, popoverMenuButtons, achievements, handleSearchChange } =
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
              id="search-achivements"
              name="search-achivements"
              placeholder="pesquisar conquista"
              onSearchChange={handleSearchChange}
            />
            <div className="ml-auto w-max">
              <PopoverMenu
                label="Abrir menu para ordernar lista de conquistas"
                buttons={popoverMenuButtons}
              >
                <button>
                  <ArrowsDownUp className="text-lg text-gray-500" />
                </button>
              </PopoverMenu>
            </div>
            <div className="-mt-8">
              {achievements?.map((achievement) => (
                <Achievement
                  key={achievement.id}
                  data={achievement}
                  isUnlocked={achievement.isUnlocked ?? false}
                  isRescuable={achievement.isRescuable ?? false}
                />
              ))}
            </div>
          </>
        ) : (
          <Loading />
        )}
      </div>
    )
}
