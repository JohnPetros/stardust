import { useEffect, useState } from 'react'

import { useChallengeStore } from '@/stores/challengeStore'

export function useLayout() {
  const resetState = useChallengeStore((store) => store.actions.resetState)

  const [isTransitionPageVisible, setIsTransitionPageVisible] = useState(true)

  useEffect(() => {
    let timeout: NodeJS.Timeout | number = 0

    timeout = setTimeout(() => setIsTransitionPageVisible(false), 5000)

    return () => {
      resetState()
      clearTimeout(timeout)
    }
  }, [resetState])

  return {
    isTransitionPageVisible,
  }
}
