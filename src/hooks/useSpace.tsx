'use client'

import { useContext } from 'react'
import { SpaceContext } from '@/contexts/SpaceContext'

export function useSpace() {
  const context = useContext(SpaceContext)

  if (!context) {
    throw new Error('useSpace must be used inside SpaceProvider')
  }

  return context
}
