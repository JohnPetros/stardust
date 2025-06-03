import type { OpenToastParams } from './OpenToastParams'

export type ToastContextValue = {
  showSuccess: (message: string, durationInSeconds?: number) => void
  showError: (message: string, durationInSeconds?: number) => void
  show: (message: string, options?: Partial<Omit<OpenToastParams, 'message'>>) => void
}
