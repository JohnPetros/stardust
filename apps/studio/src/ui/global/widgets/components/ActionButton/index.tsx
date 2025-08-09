import { useActionButtonStore } from '@/ui/global/stores/ActionButtonStore'

import { useActionButton } from './useActionButton'
import type { ActionButtonProps } from './types/ActionButtonProps'
import { ActionButtonView } from './ActionButtonView'

export const ActionButton = (props: ActionButtonProps) => {
  const { useIsExecuting, useIsSuccessful, useIsFailure, useCanExecute } =
    useActionButtonStore()
  const { isExecuting } = useIsExecuting()
  const { isSuccessful } = useIsSuccessful()
  const { isFailure } = useIsFailure()
  const { canExecute } = useCanExecute()
  const { variant, title, handleClick } = useActionButton({
    isExecuting,
    isFailure,
    isSuccessful,
    canExecute,
    titles: props.titles,
    isDisabled: props.isDisabled,
    onExecute: props.onExecute,
  })

  return (
    <ActionButtonView
      type={props.type}
      icon={props.icon}
      isDisabled={props.isDisabled || !canExecute}
      isExecuting={isExecuting}
      title={title}
      variant={variant}
      onClick={handleClick}
    />
  )
}
