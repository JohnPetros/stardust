'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { PUBLIC_ROUTES } from '@/constants'

import { FeedbackDialog } from './FeedbackDialog'

type Props = {
  children: ReactNode
}

export const FeedbackLayoutView = ({ children }: Props) => {
  const pathname = usePathname()
  const [isDialogReady, setIsDialogReady] = useState(false)
  const isPublicRoute =
    pathname === '/auth' ||
    pathname?.startsWith('/auth/') ||
    PUBLIC_ROUTES.some((route) => pathname === route || pathname?.startsWith(`${route}/`))

  useEffect(() => {
    setIsDialogReady(true)
  }, [])

  return (
    <div className='relative flex h-screen w-screen overflow-hidden'>
      <div className='flex-1 overflow-auto'>{children}</div>
      {isDialogReady && !isPublicRoute && <FeedbackDialog />}
    </div>
  )
}
