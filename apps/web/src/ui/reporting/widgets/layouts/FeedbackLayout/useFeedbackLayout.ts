'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import { PUBLIC_ROUTES } from '@/constants'

export function useFeedbackLayout() {
  const pathname = usePathname()
  const [isDialogReady, setIsDialogReady] = useState(false)

  const isPublicRoute =
    pathname === '/auth' ||
    pathname?.startsWith('/auth/') ||
    PUBLIC_ROUTES.some((route) => pathname === route || pathname?.startsWith(`${route}/`))

  useEffect(() => {
    setIsDialogReady(true)
  }, [])

  return { isDialogReady, isPublicRoute }
}
