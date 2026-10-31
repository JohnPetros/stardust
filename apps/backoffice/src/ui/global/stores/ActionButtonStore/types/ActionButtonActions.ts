export type ActionButtonActions = {
  setIsExecuting: (isExecuting: boolean) => void
  setIsSuccessful: (isSuccessful: boolean) => void
  setIsFailure: (isFailure: boolean) => void
  setIsDisabled: (isDisabled: boolean) => void
  setCanExecute: (canExecute: boolean) => void
  resetStore: () => void
}
