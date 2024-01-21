import { useEffect } from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'
import { STORAGE } from '@/utils/constants'

export type SecondsCounterRef = {
  getSeconds: () => number
}

export function SecondsCounter() {
  const localStorage = useLocalStorage()

  useEffect(() => {
    const interval = setInterval(() => {
      const currentSeconds =
        Number(localStorage.getItem(STORAGE.secondsCounter)) ?? 0

      localStorage.setItem(STORAGE.secondsCounter, String(currentSeconds + 1))
    }, 1000)

    return () => {
      clearInterval(interval)
      localStorage.removeItem(STORAGE.secondsCounter)
    }
  }, [localStorage])

  return null
}
