'use client'

import type { PropsWithChildren } from 'react'

import { useRouter } from '@/ui/global/hooks/useRouter'
import { useHomeLayout } from './useHomeLayout'
import { HomeLayoutView } from './HomeLayoutView'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

export function HomeLayout({ children }: PropsWithChildren) {
  const { notifyUserChanges } = useAuthContext()
  const { isSidenavExpanded, isTransitionVisible, handleContainerClick, toggleSidenav } =
    useHomeLayout(notifyUserChanges)
  const { currentRoute } = useRouter()

  return (
    <HomeLayoutView
      isSidenavExpanded={isSidenavExpanded}
      isTransitionVisible={isTransitionVisible}
      currentRoute={currentRoute}
      onContainerClick={handleContainerClick}
      onSidenavToggle={toggleSidenav}
    >
      {children}
    </HomeLayoutView>
  )
}
