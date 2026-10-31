import type { ActionButtonState } from './types'
import { INITIAL_ACTION_BUTTON_STATE } from './constants'
import { useZustandActionButtonStore } from '../zustand/useZustandLessonStore'

export function useActionButtonStore() {
  return {
    getState() {
      return useZustandActionButtonStore.getState().state
    },

    setState(state: ActionButtonState) {
      return useZustandActionButtonStore.setState({ state })
    },

    useIsExecuting() {
      const isExecuting = useZustandActionButtonStore((store) => store.state.isExecuting)
      const setIsExecuting = useZustandActionButtonStore(
        (store) => store.actions.setIsExecuting,
      )

      return {
        isExecuting,
        setIsExecuting,
      }
    },

    useIsSuccessful() {
      const isSuccessful = useZustandActionButtonStore(
        (store) => store.state.isSuccessful,
      )
      const setIsSuccessful = useZustandActionButtonStore(
        (store) => store.actions.setIsSuccessful,
      )

      return {
        isSuccessful,
        setIsSuccessful,
      }
    },

    useIsFailure() {
      const isFailure = useZustandActionButtonStore((store) => store.state.isFailure)
      const setIsFailure = useZustandActionButtonStore(
        (store) => store.actions.setIsFailure,
      )

      return {
        isFailure,
        setIsFailure,
      }
    },

    useCanExecute() {
      const canExecute = useZustandActionButtonStore((store) => store.state.canExecute)
      const setCanExecute = useZustandActionButtonStore(
        (store) => store.actions.setCanExecute,
      )

      return {
        canExecute,
        setCanExecute: setCanExecute,
      }
    },

    useResetStore() {
      return useZustandActionButtonStore.setState({ state: INITIAL_ACTION_BUTTON_STATE })
    },
  }
}

export const actionButtonStore = {
  getState() {
    return useZustandActionButtonStore.getState().state
  },

  setState(state: ActionButtonState) {
    return useZustandActionButtonStore.setState({ state })
  },
}
