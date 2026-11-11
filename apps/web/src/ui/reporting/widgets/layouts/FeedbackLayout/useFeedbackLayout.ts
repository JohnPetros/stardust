'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import { PUBLIC_ROUTES } from '@/constants'

type Params = {
  isEnabled: boolean
}

const ENABLED_CLASS_NAMES = {
  container: 'relative flex h-screen w-screen overflow-hidden',
  content: 'flex-1 overflow-auto',
}

const DISABLED_CLASS_NAMES = { container: 'contents', content: 'contents' }

function checkPublicRoute(pathname: string | null) {
  if (pathname === '/auth' || pathname?.startsWith('/auth/')) return true

  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`),
  )
}

export function useFeedbackLayout({ isEnabled }: Params) {
  const isPublicRoute = checkPublicRoute(usePathname())
  const [isDialogReady, setIsDialogReady] = useState(false)

  useEffect(() => {
    setIsDialogReady(true)
  }, [])

  return {
    classNames: isEnabled ? ENABLED_CLASS_NAMES : DISABLED_CLASS_NAMES,
    isDialogVisible: isEnabled && isDialogReady && !isPublicRoute,
  }
}
