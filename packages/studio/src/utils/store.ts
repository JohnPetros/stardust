import { useSyncExternalStore } from 'react'

export type Store<T> = {
  get(): T
  set(patch: Partial<T>): void
  subscribe(listener: () => void): () => void
}

// Minimal module-level state container. Shared hooks read it with useStore, so
// state can live outside the component tree without a context provider.
export function createStore<T extends object>(initial: T): Store<T> {
  let state = initial
  const listeners = new Set<() => void>()

  return {
    get() {
      return state
    },
    set(patch) {
      const changed = Object.entries(patch).some(
        ([key, value]) => state[key as keyof T] !== value,
      )
      if (!changed) return
      state = { ...state, ...patch }
      for (const listener of listeners) listener()
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

// The selector must return a primitive or an existing reference, so React only
// re-renders when that slice actually changes.
export function useStore<T, S>(store: Store<T>, selector: (state: T) => S): S {
  return useSyncExternalStore(store.subscribe, () => selector(store.get()))
}
