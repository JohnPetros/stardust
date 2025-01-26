'use client'

import type { ReactNode } from 'react'

import { useBreakpoint } from '@/ui/global/hooks/useBreakpoint'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { PageTransitionAnimation } from '@/ui/global/widgets/components/PageTransitionAnimation'
import { AnimatedContainer } from './AnimatedContainer'
import { Header } from './Header'
import { useHomeLayout } from './useHomeLayout'
import { Sidebar } from './Sidebar'
import { Sidenav } from './Sidenav'
import { TabNav } from './TabNav'
import { StreakBreakDialog } from './StreakBreakDialog'

type HomeLayoutProps = {
  children: ReactNode
}

export function HomeLayout({ children }: HomeLayoutProps) {
  const { isSidenavExpanded, isTransitionVisible, handleContainerClick, toggleSidenav } =
    useHomeLayout()
  const { md: isMobile } = useBreakpoint()
  const { currentRoute } = useRouter()
  const isChallengeRoute = currentRoute.includes('/challenging')

  if (isChallengeRoute)
    return (
      <>
        <PageTransitionAnimation isVisible={isTransitionVisible} />
        {children}
      </>
    )

  return (
    <>
      <Header />
      <Sidenav isExpanded={isSidenavExpanded} toggleSidenav={toggleSidenav} />
      <PageTransitionAnimation isVisible={isTransitionVisible} />
      <StreakBreakDialog />
      <Sidebar />
      <AnimatedContainer
        isSidenavExpanded={isSidenavExpanded}
        onClick={handleContainerClick}
      >
        {children}
      </AnimatedContainer>
      <TabNav />
    </>
  )
}
