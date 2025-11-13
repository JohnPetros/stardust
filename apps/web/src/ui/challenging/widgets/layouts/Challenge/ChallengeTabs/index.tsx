'use client'

import type { ReactNode } from 'react'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useChallengeTabs } from './useChallengeTabs'

import { ChallengeTabsView } from './ChallengeTabsView'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'

type TabsProps = {
  children: ReactNode
}

export const ChallengeTabs = ({ children }: TabsProps) => {
  const { isAccountAuthenticated } = useAuthContext()
  const { activeContent, handleShowSolutions } = useChallengeTabs()
  const { getCraftsVisibilitySlice } = useChallengeStore()
  const { craftsVislibility } = getCraftsVisibilitySlice()

  return (
    <ChallengeTabsView
      isAccountAuthenticated={isAccountAuthenticated}
      activeContent={activeContent}
      craftsVislibility={craftsVislibility}
      onShowSolutions={handleShowSolutions}
    >
      {children}
    </ChallengeTabsView>
  )
}
