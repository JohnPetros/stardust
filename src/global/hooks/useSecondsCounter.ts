import { useEffect } from 'react'

import { STORAGE } from '@/global/constants'

export function useSecondsCounter(isEnabled: boolean) {
  useEffect(() => {
    if (!isEnabled) return

    const interval = setInterval(() => {
      const currentSeconds =
        Number(localStorage.getItem(STORAGE.keys.secondsCounter)) ?? 0

      localStorage.setItem(
        STORAGE.keys.secondsCounter,
        String(currentSeconds + 1)
      )
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [isEnabled])
}
