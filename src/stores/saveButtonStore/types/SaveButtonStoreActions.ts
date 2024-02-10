import type { SaveHandler } from './SaveHandler'

export type SaveButtonStoreActions = {
  setSaveHandler: (saveHandler: SaveHandler) => void
  setShouldSave: (shouldSave: boolean) => void
  setCanSave: (shouldSave: boolean) => void
  resetState: () => void
}
