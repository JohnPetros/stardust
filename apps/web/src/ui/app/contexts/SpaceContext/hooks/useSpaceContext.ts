'use client'

import { useContext } from 'react'

import { SpaceContext } from '..'
import { AppError } from '@/@core/errors/global/AppError'

export function useSpaceContext() {
  const context = useContext(SpaceContext)

  if (!context) {
    throw new AppError('useSpaceContext must be used inside SpaceProvider')
  }

  return context
}
