'use client'

import { createContext, useRef, type ReactNode } from 'react'

import type { AchievementDto } from '@stardust/core/profile/entities/dtos'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { useRest } from '@/ui/global/hooks/useRest'
import { NewUnlockedAchievementsAlertDialog } from './components/NewUnlockedAchievementsAlertDialog'
import { useAchivementsProvider } from './hooks/useAchievementsProvider'
import { useAchievementsContext } from './hooks/useAchievementsContext'
import type { AchivementsContextValue } from './types/AchivementsContextValue'

type AchivementsContextProps = {
  children: ReactNode
  achievementsDto: AchievementDto[]
}

export const AchivementsContext = createContext({} as AchivementsContextValue)

export function AchivementsProvider({
  children,
  achievementsDto,
}: AchivementsContextProps) {
  const { profileService } = useRest()
  const newUnlockedAchievementsAlertDialogRef = useRef<AlertDialogRef | null>(null)
  const {
    newUnlockedAchievements,
    rescueAchivement,
    handleNewUnlockedAchievementsAlertDialogClose,
  } = useAchivementsProvider(profileService, newUnlockedAchievementsAlertDialogRef)

  return (
    <AchivementsContext.Provider
      value={{
        achievementsDto,
        newUnlockedAchievements,
        rescueAchivement,
      }}
    >
      <NewUnlockedAchievementsAlertDialog
        achievements={newUnlockedAchievements}
        alertDialogRef={newUnlockedAchievementsAlertDialogRef}
        onClose={() => handleNewUnlockedAchievementsAlertDialogClose(false)}
      />
      {children}
    </AchivementsContext.Provider>
  )
}

export { useAchievementsContext }
