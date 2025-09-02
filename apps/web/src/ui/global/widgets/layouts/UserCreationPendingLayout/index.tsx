'use client'

import type { PropsWithChildren } from 'react'

import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { useProfileSocket } from '@/ui/global/hooks/useProfileSocket'
import { UserCreationPendingLayoutView } from './UserCreationPendingLayoutView'
import { useUserCreationPendingLayout } from './useUserCreationPendingLayout'

export const UserCreationPendingLayout = ({ children }: PropsWithChildren) => {
  const { user } = useAuthContext()
  const { isUserCreationPending, handleUserCreated } = useUserCreationPendingLayout(
    user !== null,
  )
  useProfileSocket(handleUserCreated)

  return (
    <UserCreationPendingLayoutView isUserCreationPending={isUserCreationPending}>
      {children}
    </UserCreationPendingLayoutView>
  )
}
