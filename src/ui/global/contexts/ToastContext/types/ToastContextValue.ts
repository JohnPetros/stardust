import type { OpenToastParams } from './OpenToastParams'

export type ToastContextValue = {
  show: (message: string, options?: Partial<Omit<OpenToastParams, 'message'>>) => void
}
