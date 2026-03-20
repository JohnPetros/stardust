type Params = {
  onConfirm: () => void
  onCancel: () => void
}

export function useChallengeNavigationAlertDialog({ onConfirm, onCancel }: Params) {
  function handleConfirmClick() {
    onConfirm()
  }

  function handleCancelClick() {
    onCancel()
  }

  return {
    handleConfirmClick,
    handleCancelClick,
  }
}
