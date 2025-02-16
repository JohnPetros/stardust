import { useCallback } from 'react'

const DEFAULT_SLEEP_TIMEOUT = 1000 // miliseconds

export function useSleep() {
  const sleep = useCallback(async (timeout = DEFAULT_SLEEP_TIMEOUT) => {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, timeout)
    })
  }, [])

  return {
    sleep,
  }
}
