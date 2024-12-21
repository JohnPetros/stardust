'use client'

import { createContext, useRef, type ReactNode } from 'react'

import type { AchievementDto } from '#dtos'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { NewUnlockedAchievementsAlertDialog } from './components/NewUnlockedAchievementsAlertDialog'
import { useAchivementsProvider } from './hooks/useAchievementsProvider'
import { useAchievementsContext } from './hooks/useAchievementsContext'
import type { AchivementsContextValue } from './types/AchivementsContextValue'
import { _observeNewUnlockedAchievements } from './actions'

type AchivementsContextProps = {
  children: ReactNode
  achievementsDto: AchievementDto[]
}

export const AchivementsContext = createContext({} as AchivementsContextValue)

export function AchivementsProvider({
  children,
  achievementsDto,
}: AchivementsContextProps) {
  const newUnlockedAchievementsAlertDialogRef = useRef<AlertDialogRef>(null)

  const {
    newUnlockedAchievements,
    rescueAchivement,
    handleNewUnlockedAchievementsAlertDialogClose,
  } = useAchivementsProvider(
    achievementsDto,
    newUnlockedAchievementsAlertDialogRef,
    _observeNewUnlockedAchievements,
  )

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
