export interface ToastProvider {
  showSuccess: (message: string) => void
  showError: (message: string) => void
}
