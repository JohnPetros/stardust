'use client'

import { ReactNode, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { usePathname } from 'next/navigation'

import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { Sidenav } from './Sidenav'
import { TabNav } from './TabNav'

import { useSiderbar } from '@/contexts/SidebarContext'
import { useBreakpoint } from '@/hooks/useBreakpoint'

const layoutVariants: Variants = {
  mobile: {
    paddingLeft: 0,
  },
  shrink: {
    paddingLeft: 80,
  },
  expand: {
    paddingLeft: 160,
  },
}

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [isSidenavExpanded, setIsSidenavExpanded] = useState(false)
  const {
    isOpen,
    toggle,
    isAchievementsListVisible,
    setIsAchievementsListVisible,
  } = useSiderbar()

  const { md: isMobile } = useBreakpoint()

  const pathName = usePathname()

  function toggleSidenav() {
    setIsSidenavExpanded(!isSidenavExpanded)
  }

  function handleMainContainerClick() {
    if (isOpen) toggle()

    if (isAchievementsListVisible) setIsAchievementsListVisible(false)
  }

  const isChallengePage = new RegExp(
    '^/challenges/[0-9a-fA-F-]+(\\?.*)?$'
  ).test(pathName)

  if (isChallengePage) return children

  return (
    <>
      <Header />
      <Sidenav isExpanded={isSidenavExpanded} toggleSidenav={toggleSidenav} />
      {isMobile && <Sidebar />}
      <motion.main
        variants={layoutVariants}
        initial="shrink"
        animate={isSidenavExpanded ? 'expand' : isMobile ? 'mobile' : 'shrink'}
        className="h-full pt-16"
        onClick={handleMainContainerClick}
      >
        {children}
      </motion.main>
      <TabNav />
    </>
  )
}
