import type { OpenToastParams } from './OpenToastParams'

export type ToastRef = {
  open: ({ type, message, seconds }: OpenToastParams) => void
}
