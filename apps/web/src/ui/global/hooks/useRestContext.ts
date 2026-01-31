'use client'

import { useContext } from 'react'
import { AppError } from '@stardust/core/global/errors'
import { RestContext } from '../contexts/RestContext'

export function useRestContext() {
  const context = useContext(RestContext)

  if (!context) {
    throw new AppError('useRestContext must be used inside RestContextProvider')
  }

  return context
}
