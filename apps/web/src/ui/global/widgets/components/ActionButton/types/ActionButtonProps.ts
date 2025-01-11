import type { ClassNameValue } from 'tailwind-merge'

import type { IconName } from '../../Icon/types'

export type ActionButtonProps = {
  type: 'button' | 'submit'
  icon: IconName
  isExecuting: boolean
  isDisabled: boolean
  isSuccess: boolean
  isFailure: boolean
  canExecute: boolean
  className?: ClassNameValue
  titles: {
    default: string
    canExecute: string
    executing: string
    success: string
    failure: string
  }
  onExecute?: () => Promise<void>
}
