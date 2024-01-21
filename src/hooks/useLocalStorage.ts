'use client'

import { useClientContext } from '@/contexts/ClientContext'

export function useLocalStorage() {
  const isClientSide = useClientContext()

  function setItem(key: string, value: string) {
    if (isClientSide) localStorage.setItem(key, value)
  }

  function getItem(key: string) {
    return isClientSide ? localStorage.getItem(key) : null
  }

  function removeItem(key: string) {
    if (isClientSide) localStorage.removeItem(key)
  }

  function hasItem(key: string) {
    return isClientSide ? Boolean(getItem(key)) : false
  }

  return {
    setItem,
    getItem,
    removeItem,
    hasItem,
  }
}
