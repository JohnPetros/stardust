import { useState, useEffect } from 'react'

export function useUserCreationPendingLayout(user: User | null) {
  const [isUserCreationPending, setIsUserCreationPending] = useState(user === null)

  function handleUserCreated() {
    setIsUserCreationPending(false)
  }

  useEffect(() => {
    setIsUserCreationPending(user === null)
  }, [user])

  return {
    isUserCreationPending,
    handleUserCreated,
  }
}
