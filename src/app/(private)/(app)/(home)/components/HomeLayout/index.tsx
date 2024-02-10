'use client'

import { ReactNode } from 'react'
import { motion, Variants } from 'framer-motion'

import { HomeHeader } from '../HomeHeader'
import { Sidebar } from '../Sidebar'
import { Sidenav } from '../Sidenav'
import { TabNav } from '../TabNav'

import { useHomeLayout } from './useHomeLayout'

import { useBreakpoint } from '@/global/hooks/useBreakpoint'

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

export function HomeLayout({ children }: LayoutProps) {
  const { isSidenavExpanded, handleMainContainerClick, toggleSidenav } =
    useHomeLayout()

  const { md: isMobile } = useBreakpoint()

  return (
    <>
      <HomeHeader />
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
