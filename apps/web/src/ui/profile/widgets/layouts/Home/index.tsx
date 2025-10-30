'use client'

import type { PropsWithChildren } from 'react'

import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { useHomeLayout } from './useHomeLayout'
import { HomeLayoutView } from './HomeLayoutView'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

export function HomeLayout({ children }: PropsWithChildren) {
  const { notifyUserChanges } = useAuthContext()
  const { isSidenavExpanded, isTransitionVisible, handleContainerClick, toggleSidenav } =
    useHomeLayout(notifyUserChanges)
  const { currentRoute } = useNavigationProvider()

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
