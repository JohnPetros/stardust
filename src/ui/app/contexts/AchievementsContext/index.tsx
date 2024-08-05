'use client'

import { createContext, useRef, type ReactNode } from 'react'

import type { AchievementDTO } from '@/@core/dtos'

import type { AlertDialogRef } from '@/ui/global/components/shared/AlertDialog/types'
import { NewUnlockedAchievementsAlertDialog } from './components/NewUnlockedAchievementsAlertDialog'
import { useAchivementsProvider } from './hooks/useAchievementsProvider'
import { useAchievementsContext } from './hooks/useAchievementsContext'
import type { AchivementsContextValue } from './types/AchivementsContextValue'
import { _observeNewUnlockedAchievements } from './actions'

type AchivementsContextProps = {
  children: ReactNode
  achievementsDTO: AchievementDTO[]
}

export const AchivementsContext = createContext({} as AchivementsContextValue)

export function AchivementsProvider({
  children,
  achievementsDTO,
}: AchivementsContextProps) {
  const newUnlockedAchievementsAlertDialogRef = useRef<AlertDialogRef>(null)

  const {
    newUnlockedAchievements,
    rescueAchivement,
    handleNewUnlockedAchievementsAlertDialogClose,
  } = useAchivementsProvider(
    achievementsDTO,
    newUnlockedAchievementsAlertDialogRef,
    _observeNewUnlockedAchievements
  )

  return (
    <AchivementsContext.Provider
      value={{
        achievementsDTO,
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
