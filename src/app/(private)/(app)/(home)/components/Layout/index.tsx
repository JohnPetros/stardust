'use client'

import { ReactNode } from 'react'
import { motion, Variants } from 'framer-motion'

import { Header } from '../Header'
import { Sidebar } from '../Sidebar'
import { Sidenav } from '../Sidenav'
import { TabNav } from '../TabNav'

import { useLayout } from './useLayout'

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

type LayoutProps = {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const {
    isSidenavExpanded,
    isChallengePage,
    handleMainContainerClick,
    toggleSidenav,
  } = useLayout()

  const { md: isMobile } = useBreakpoint()

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
