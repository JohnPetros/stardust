type Type = 'error' | 'success'

export type OpenToastParams = {
  type: Type
  message: string
  seconds?: number
}
