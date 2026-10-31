import { createStore, useStore } from '@/utils/store'

// Shared across the app: created once, outside any component, so every caller
// reads the same state without a provider.
const uiStore = createStore({ controlsExpanded: true })

function toggleControls() {
  uiStore.set({ controlsExpanded: !uiStore.get().controlsExpanded })
}

export function useUI() {
  const controlsExpanded = useStore(uiStore, (state) => state.controlsExpanded)

  return { controlsExpanded, toggleControls }
}
