'use client'

export function useLocalStorage() {
  function setItem(key: string, value: string) {
    localStorage.setItem(key, value)
  }

  function getItem(key: string) {
    return localStorage.getItem(key)
  }

  function removeItem(key: string) {
    localStorage.removeItem(key)
  }

  function hasItem(key: string) {
    return Boolean(getItem(key))
  }

  return {
    setItem,
    getItem,
    removeItem,
    hasItem,
  }
}
