import type { SaveButtonStoreState } from '../types/SaveButtonStoreState'

export const INITIAL_SAVE_BUTTON_STORE_STATE: SaveButtonStoreState = {
  saveHandler: null,
  shouldSave: false,
  canSave: false,
}
