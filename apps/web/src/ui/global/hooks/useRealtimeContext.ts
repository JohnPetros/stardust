'use client'

import { useContext } from 'react'
import { AppError } from '@stardust/core/global/errors'
import { RealtimeContext } from '../contexts/RealtimeContext'

export function useRealtimeContext() {
  const context = useContext(RealtimeContext)

  if (!context) {
    throw new AppError('useRealtimeContext must be used inside RealtimeContextProvider')
  }

  return context
}
