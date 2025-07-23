import { useContext } from 'react'

import { AppError } from '@stardust/core/global/errors'
import { AuthContext } from '@/ui/auth/contexts/AuthContext'

export function useAuthContext() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new AppError('useAuthContext must be used with AuthContextProvider')
  }

  return context
}
