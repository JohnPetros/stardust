import type { SaveHandler } from './SaveHandler'

export type SaveButtonStoreState = {
  saveHandler: SaveHandler
  shouldSave: boolean
  canSave: boolean
}
