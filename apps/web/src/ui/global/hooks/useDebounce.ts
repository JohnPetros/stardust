'use client'

import { useEffect, useRef } from 'react'

export function useDebounce(
  callback: (...params: unknown[]) => void,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const timeout = timeoutRef.current

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [])

  return function debounce(...params: unknown[]) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      callback(...params)
    }, delay)
  }
}
