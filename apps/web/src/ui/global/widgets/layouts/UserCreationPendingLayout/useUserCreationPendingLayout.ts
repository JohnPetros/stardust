import { useEffect, useState } from 'react'

import type { User } from '@stardust/core/profile/entities'

export function useUserCreationPendingLayout(user: User | null) {
  const [isUserCreationPending, setIsUserCreationPending] = useState(user !== null)

  function handleUserCreated() {
    setIsUserCreationPending(false)
  }

  useEffect(() => {
    if (user) setIsUserCreationPending(false)
  }, [user])

  return {
    isUserCreationPending,
    handleUserCreated,
  }
}
