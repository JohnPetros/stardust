import { useContext } from 'react'

import { AppError } from '@stardust/core/global/errors'

import { ToastContext } from '..'

export function useToastContext() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new AppError('useToastContext must be used inside ToastContext')
  }

  return context
}
