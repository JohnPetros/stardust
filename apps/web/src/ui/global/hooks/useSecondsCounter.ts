import { useEffect } from 'react'

import { useLocalStorage } from './useLocalStorage'
import { STORAGE } from '../../../constants'

export function useSecondsCounter(isEnabled: boolean) {
  const secondsStorage = useLocalStorage(STORAGE.keys.secondsCounter)

  useEffect(() => {
    if (!isEnabled) return

    const interval = setInterval(() => {
      const currentSeconds = Number(secondsStorage.get()) ?? 0

      secondsStorage.set(String(currentSeconds + 1))
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [isEnabled])
}
