import { create } from 'zustand'

import type { ActionButtonStore } from '../ActionButtonStore/types'
import { INITIAL_ACTION_BUTTON_STATE } from '../ActionButtonStore/constants'

export const useZustandActionButtonStore = create<ActionButtonStore>((set) => ({
  state: INITIAL_ACTION_BUTTON_STATE,
  actions: {
    setIsExecuting(isExecuting: boolean) {
      set(({ state, actions }) => ({
        state: { ...state, isExecuting },
        actions,
      }))
    },

    setIsSuccessful(isSuccessful: boolean) {
      set(({ state, actions }) => ({
        state: { ...state, isSuccessful },
        actions,
      }))
    },

    setIsFailure(isFailure: boolean) {
      set(({ state, actions }) => ({
        state: { ...state, isFailure },
        actions,
      }))
    },

    setIsDisabled(isDisabled: boolean) {
      set(({ state, actions }) => ({
        state: { ...state, isDisabled },
        actions,
      }))
    },

    setCanExecute(canExecute: boolean) {
      set(({ state, actions }) => ({
        state: { ...state, canExecute },
        actions,
      }))
    },

    resetStore() {
      set(({ actions }) => ({
        state: INITIAL_ACTION_BUTTON_STATE,
        actions,
      }))
    },
  },
}))
