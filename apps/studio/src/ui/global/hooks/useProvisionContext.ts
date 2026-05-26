import { useContext } from 'react'

import { AppError } from '@stardust/core/global/errors'

import { ProvisionContext } from '../contexts/ProvisionContext'

export function useProvisionContext() {
  const context = useContext(ProvisionContext)

  if (!context) {
    throw new AppError('useProvisionContext must be used inside ProvisionContextProvider')
  }

  return context
}
