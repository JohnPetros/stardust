'use client'

export function useLocalStorage() {
  function setItem(key: string, value: string) {
    window.localStorage.setItem(key, value)
  }

  function getItem(key: string) {
    return window.localStorage.getItem(key)
  }

  function removeItem(key: string) {
    window.localStorage.removeItem(key)
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
