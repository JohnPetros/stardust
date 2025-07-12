import { type ClassNameValue, twMerge } from 'tailwind-merge'

import { Button } from '../Button'
import { Icon } from '../Icon'
import type { IconName } from '../Icon/types'

type Props = {
  type: 'button' | 'submit'
  icon: IconName
  isExecuting: boolean
  isDisabled: boolean
  className?: ClassNameValue
  variant: string
  title: string
  onClick: () => void
}

export const ActionButtonView = ({
  type,
  icon,
  isExecuting,
  isDisabled,
  className,
  variant,
  title,
  onClick,
}: Props) => {
  return (
    <Button
      type={type}
      disabled={isDisabled || isExecuting}
      className={twMerge(
        'flex h-10 items-center gap-1 border border-transparent capitalize',
        variant,
        className,
      )}
      onClick={onClick}
    >
      <Icon name={icon} size={16} className={twMerge('text-lg', variant)} weight='bold' />
      {title}
    </Button>
  )
}
