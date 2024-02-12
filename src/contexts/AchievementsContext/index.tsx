'use client'

import { createContext, ReactNode } from 'react'

import { useAchivementsProvider } from './hooks/useAchivementsProvider'

import type { Achievement as AchievementData } from '@/@types/Achievement'
import { Achievement } from '@/app/(private)/(app)/(home)/components/Achievement'
import { ShinningAnimation } from '@/app/(private)/(app)/(home)/components/ShinningAnimation'
import { AlertDialog } from '@/global/components/AlertDialog'
import { Button } from '@/global/components/Button'

export type AchivementsContextValue = {
  achievements: AchievementData[] | undefined
  rescueableAchievementsCount: number
  rescueAchivement: (
    rescuableAchiementId: string,
    rescuableAchiementReward: number
  ) => Promise<void>
  handleRescuedAchievementsAlertDialogClose: (
    rescuedAchiementId: string
  ) => void
}

type AchivementsContextProps = {
  children: ReactNode
}

export const AchivementsContext = createContext({} as AchivementsContextValue)

export function AchivementsProvider({ children }: AchivementsContextProps) {
  const {
    achievements,
    newUnlockedAchievements,
    rescueableAchievementsCount,
    newUnlockedAchievementsAlertDialogRef,
    rescueAchivement,
    handleNewUnlockedAchievementsAlertDialogClose,
    handleRescuedAchievementsAlertDialogClose,
  } = useAchivementsProvider()

  return (
    <AchivementsContext.Provider
      value={{
        achievements,
        rescueableAchievementsCount,
        rescueAchivement,
        handleRescuedAchievementsAlertDialogClose,
      }}
    >
      <div className="absolute">
        <AlertDialog
          ref={newUnlockedAchievementsAlertDialogRef}
          type={'earning'}
          title={'Uau! Parece que você ganhou recompensa(s)'}
          body={
            <div className="max-h-64 overflow-auto px-6">
              {newUnlockedAchievements.map((achievement) => (
                <div key={achievement.id} className="relative">
                  <span
                    className="absolute block"
                    style={{ top: -18, left: -31.5 }}
                  >
                    <ShinningAnimation size={110} />
                  </span>

                  <Achievement
                    data={achievement}
                    isUnlocked={true}
                    isRescuable={false}
                  />
                </div>
              ))}
            </div>
          }
          action={
            <div className="mt-8 w-full">
              <Button
                onClick={() =>
                  handleNewUnlockedAchievementsAlertDialogClose(false)
                }
              >
                Entendido
              </Button>
            </div>
          }
          onOpenChange={handleNewUnlockedAchievementsAlertDialogClose}
        />
      </div>
      {children}
    </AchivementsContext.Provider>
  )
}
