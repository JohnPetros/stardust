'use client'

import { ReactNode } from 'react'

import { useHydration } from './useHydration'

type HydrationProps = {
  children: ReactNode
}

export function Hydration({ children }: HydrationProps) {
  const { isHydrated } = useHydration()

  return isHydrated ? children : null
}
