import { useMemo } from 'react'
import type { ActionButtonProps } from './types/ActionButtonProps'

const variants = {
  default: 'bg-green-400 text-gray-900',
  canExecute: 'animate-pulse',
  executing: 'border-yellow-400 bg-transparent text-yellow-400',
  success: 'border-green-400 bg-transparent text-green-400',
  failure: 'border-red-700 bg-transparent text-red-700',
}

export function useActionButton({
  isExecuting,
  isSuccess,
  canExecute,
  titles,
  isFailure,
  isDisabled,
  onExecute,
}: Omit<ActionButtonProps, 'type' | 'icon' | 'className'>) {
  const [variant, title] = useMemo(() => {
    if (isExecuting) {
      return [variants.executing, titles.executing]
    }
    if (isSuccess) {
      return [variants.success, titles.success]
    }
    if (isFailure) {
      return [variants.failure, titles.failure]
    }
    if (canExecute && !isDisabled) {
      return [variants.canExecute, titles.canExecute]
    }
    return [variants.default, titles.default]
  }, [titles, canExecute, isSuccess, isDisabled, isExecuting, isFailure])

  async function handleClick() {
    if (onExecute) await onExecute()
  }

  return {
    variant,
    title,
    handleClick,
  }
}
