import { twMerge } from 'tailwind-merge'

import { Button } from '../Button'
import { Icon } from '../Icon'
import { useActionButton } from './useActionButton'
import type { ActionButtonProps } from './types/ActionButtonProps'

export function ActionButton(props: ActionButtonProps) {
  const { variant, title, handleClick } = useActionButton(props)

  return (
    <Button
      type={props.type}
      disabled={props.isDisabled || props.isExecuting}
      className={twMerge(
        'flex h-10 items-center gap-1 border border-transparent capitalize',
        variant,
        props.className,
      )}
      onClick={handleClick}
    >
      <Icon
        name={props.icon}
        size={16}
        className={twMerge('text-lg', variant)}
        weight='bold'
      />
      {title}
    </Button>
  )
}
