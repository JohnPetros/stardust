import { useActionButton } from './useActionButton'
import type { ActionButtonProps } from './types/ActionButtonProps'
import { ActionButtonView } from './ActionButtonView'

export const ActionButton = (props: ActionButtonProps) => {
  const { variant, title, handleClick } = useActionButton(props)

  return (
    <ActionButtonView
      type={props.type}
      icon={props.icon}
      isExecuting={props.isExecuting}
      isDisabled={props.isDisabled}
      title={title}
      variant={variant}
      onClick={handleClick}
    />
  )
}
