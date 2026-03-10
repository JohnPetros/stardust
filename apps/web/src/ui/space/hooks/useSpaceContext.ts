'use client'

import { useContext } from 'react'

import { AppError } from '@stardust/core/global/errors'

import { SpaceContext } from '../contexts/SpaceContext'

export function useSpaceContext() {
  const context = useContext(SpaceContext)

  if (!context) {
    throw new AppError('useSpaceContext must be used inside SpaceProvider')
  }

  return context
}
