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
        'flex h-8 w-32 items-center gap-2 border border-transparent',
        variant,
        props.className,
      )}
      onClick={handleClick}
    >
      <Icon name={props.icon} className={twMerge('text-lg', variant)} weight='bold' />
      {title}
    </Button>
  )
}
