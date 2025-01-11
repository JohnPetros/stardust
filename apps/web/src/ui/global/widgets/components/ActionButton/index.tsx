import { twMerge } from 'tailwind-merge'

import { Button } from '../Button'
import { Icon } from '../Icon'
import { useActionButton } from './useActionButton'
import type { ActionButtonProps } from './types/ActionButtonProps'

export function ActionButton(props: ActionButtonProps) {
  const { variant, title, handleClick } = useActionButton(props)

  return (
    <Button
      disabled={props.isDisabled}
      className={twMerge(
        'flex h-10 min-w-32 items-center gap-1 border border-transparent capitalize',
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
