'use client'

import type { ReactNode } from 'react'

import { useBreakpoint } from '@/ui/global/hooks'

import { AnimatedContainer } from './AnimatedContainer'
import { Header } from './Header'
import { useHomeLayout } from './useHomeLayout'
import { Sidebar } from './Sidebar'
import { Sidenav } from './Sidenav'
import { TabNav } from './TabNav'
import { PageTransitionAnimation } from '@/ui/global/components/shared/PageTransitionAnimation'

type HomeLayoutProps = {
  children: ReactNode
}

export function HomeLayout({ children }: HomeLayoutProps) {
  const { isSidenavExpanded, isTransitionVisible, handleContainerClick, toggleSidenav } =
    useHomeLayout()

  const { md: isMobile } = useBreakpoint()

  return (
    <>
      <Header />
      <Sidenav isExpanded={isSidenavExpanded} toggleSidenav={toggleSidenav} />

      <PageTransitionAnimation isVisible={isTransitionVisible} />

      {isMobile && <Sidebar />}

      <AnimatedContainer
        isSidenavExpanded={isSidenavExpanded}
        isMobile={isMobile}
        onClick={handleContainerClick}
      >
        {children}
      </AnimatedContainer>
      <TabNav />
    </>
  )
}
