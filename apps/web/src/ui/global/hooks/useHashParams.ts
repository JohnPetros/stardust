import { useState, useEffect } from 'react'

export function useHashParams(key: string) {
  const [value, setValue] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && !value) {
      const hash = window.location.hash
      const params = new URLSearchParams(hash.substring(1))
      setValue(params.get(key) ?? null)
    }
  }, [key, value])

  return value
}
