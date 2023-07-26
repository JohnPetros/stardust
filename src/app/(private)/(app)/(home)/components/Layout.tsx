'use client'
import { ReactNode, useCallback, useState } from 'react'

import { Header } from './Header'
import { TabNav } from './TabNav'
import { Sidebar } from './Sidebar'
import { Sidenav } from './Sidenav'

import { Variants, motion } from 'framer-motion'

const layoutVariants: Variants = {
  shrink: {
    paddingLeft: 84,
  },
  expand: {
    paddingLeft: 180,
  },
}

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [isSidenavExpanded, setIsSidenavExpanded] = useState(false)

  function toggleSidenav() {
    setIsSidenavExpanded(!isSidenavExpanded)
  }

  return (
    <>
      <Header />
      <Sidenav isExpanded={isSidenavExpanded} toggleSidenav={toggleSidenav} />
      <Sidebar />
      <motion.main
        variants={layoutVariants}
        initial="shrink"
        animate={isSidenavExpanded ? 'expand' : 'shrink'}
        className="pt-16"
      >
        {children}
      </motion.main>
      <TabNav />
    </>
  )
}
