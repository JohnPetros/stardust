import { useMemo } from 'react'
import type { ActionButtonProps } from './types/ActionButtonProps'
import type { ActionButtonTitles } from './types/ActionButtonTitles'

const variants = {
  default: 'bg-red-700 text-green-950',
  canExecute: 'animate-pulse',
  executing: 'border-yellow-400 bg-transparent text-yellow-400',
  success: 'border-green-400 bg-transparent text-green-400',
  failure: 'border-red-700 bg-transparent text-red-700',
}

type Props = {
  isExecuting: boolean
  isFailure: boolean
  isSuccessful: boolean
  canExecute: boolean
  titles: ActionButtonTitles
  isDisabled: boolean
  onExecute?: () => Promise<void>
}

export function useActionButton({
  isExecuting,
  isFailure,
  isSuccessful,
  canExecute,
  titles,
  isDisabled,
  onExecute,
}: Props) {
  const [variant, title] = useMemo(() => {
    if (isExecuting) {
      return [variants.executing, titles.executing]
    }
    if (isSuccessful) {
      return [variants.success, titles.success]
    }
    if (isFailure) {
      return [variants.failure, titles.failure]
    }
    if (canExecute && !isDisabled) {
      return [variants.canExecute, titles.canExecute]
    }
    return [variants.default, titles.default]
  }, [titles, canExecute, isSuccessful, isDisabled, isExecuting, isFailure])

  async function handleClick() {
    if (onExecute) await onExecute()
  }

  return {
    variant,
    title,
    handleClick,
  }
}
