import type { ActionButtonState } from '../types/ActionButtonState'

export const INITIAL_ACTION_BUTTON_STATE: ActionButtonState = {
  isExecuting: false,
  isSuccessful: false,
  isFailure: false,
  canExecute: false,
}
