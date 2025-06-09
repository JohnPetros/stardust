'use client'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { WarningMessageView } from './WarningMessageView'

export const WarningMessage = () => {
  const { user } = useAuthContext()
  if (user) return <WarningMessageView shouldShow={user.hasCompletedSpace.isFalse} />
}
