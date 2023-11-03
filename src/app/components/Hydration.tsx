'use client'

import { ReactNode, useEffect, useState } from 'react'

interface HydrationProps {
  children: ReactNode
}

export function Hydration({ children }: HydrationProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated ? children : null
}
