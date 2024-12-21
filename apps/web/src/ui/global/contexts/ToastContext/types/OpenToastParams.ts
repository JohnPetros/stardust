import type { ToastType } from './ToastType'

export type OpenToastParams = {
  type: ToastType
  message: string
  seconds?: number
}
