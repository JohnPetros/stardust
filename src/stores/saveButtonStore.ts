import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { INITIAL_SAVE_BUTTON_STORE_STATE } from './saveButtonStore/constants/initial-save-button-store-state'
import type { SaveButtonStoreActions } from './saveButtonStore/types/SaveButtonStoreActions'
import type { SaveButtonStoreState } from './saveButtonStore/types/SaveButtonStoreState'
import type { SaveHandler } from './saveButtonStore/types/SaveHandler'

type SaveButtonStoreProps = {
  state: SaveButtonStoreState
  actions: SaveButtonStoreActions
}

export const useSaveButtonStore = create<SaveButtonStoreProps>()(
  immer((set) => {
    return {
      state: INITIAL_SAVE_BUTTON_STORE_STATE,
      actions: {
        setSaveHandler(saveHandler: SaveHandler) {
          return set(({ state }) => {
            state.saveHandler = saveHandler
          })
        },
        setShouldSave(shouldSave: boolean) {
          return set(({ state }) => {
            state.shouldSave = shouldSave
          })
        },
        setCanSave(canSave: boolean) {
          return set(({ state }) => {
            state.canSave = canSave
          })
        },
        resetState() {
          return set(({ actions }) => ({
            state: INITIAL_SAVE_BUTTON_STORE_STATE,
            actions,
          }))
        },
      },
    }
  })
)
