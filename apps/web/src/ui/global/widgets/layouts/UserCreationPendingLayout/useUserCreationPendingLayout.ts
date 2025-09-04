import { useState } from 'react'

export function useUserCreationPendingLayout(isUserCreated: boolean) {
  const [isUserCreationPending, setIsUserCreationPending] = useState(isUserCreated)

  function handleUserCreated() {
    setIsUserCreationPending(false)
  }

  return {
    isUserCreationPending,
    handleUserCreated,
  }
}
