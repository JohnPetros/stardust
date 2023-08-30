'use client'

import { ReactNode, useState, useEffect } from 'react'

import { Header } from './Header'
import { TabNav } from './TabNav'
import { Sidebar } from './Sidebar'
import { Sidenav } from './Sidenav'

import { Variants, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

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
  const [isMobile, setIsMobile] = useState(false)

  const pathName = usePathname()

  useEffect(() => {
    const isMobile = innerWidth <= 768
    setIsMobile(isMobile)
  }, [])

  function toggleSidenav() {
    setIsSidenavExpanded(!isSidenavExpanded)
  }

  const isChallengePage = new RegExp('^/challenges/[0-9a-fA-F-]+(\\?.*)?$').test(pathName);
  
  if (isChallengePage) return children

  return (
    <>
      <Header />
      <Sidenav isExpanded={isSidenavExpanded} toggleSidenav={toggleSidenav} />
      <Sidebar />
      <motion.main
        variants={layoutVariants}
        initial="shrink"
        animate={isSidenavExpanded ? 'expand' : isMobile ? 'mobile' : 'shrink'}
        className="pt-16 h-full "
      >
        {children}
      </motion.main>
      <TabNav />
    </>
  )
}
