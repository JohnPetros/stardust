import { useCallback } from 'react'

const IS_SERVER = typeof window === 'undefined'

export function useLocalStorage<Value = string>(key: string) {
  const get = useCallback(() => {
    function deserialize(value: string) {
      return JSON.parse(value) as Value
    }

    if (IS_SERVER) return null

    const item = window.localStorage.getItem(key)
    return item && item !== undefined ? deserialize(item) : null
  }, [key])

  const set = useCallback(
    (value: Value) => {
      function serialize(value: Value) {
        return JSON.stringify(value)
      }

      window.localStorage.setItem(key, serialize(value))
    },
    [key],
  )

  function has() {
    return Boolean(get())
  }

  function remove() {
    window.localStorage.removeItem(key)
  }

  return {
    get,
    set,
    has,
    remove,
  }
}
