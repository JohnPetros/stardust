import { useContext } from 'react'

import { AppError } from '@stardust/core/global/errors'

import { AuthContext } from '@/ui/auth/contexts/AuthContext'

export function useAuthContext() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new AppError('useAuth must be used inside AuthProvider')
  }

  return context
}
