import { type ClassNameValue, twMerge } from 'tailwind-merge'

import { Icon } from '../Icon'
import type { IconName } from '../Icon/types'
import { Button } from '@/ui/shadcn/components/button'

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
        'flex h-10 items-center gap-1 border border-transparent capitalize font-semibold hover:text-green-100',
        variant,
        className,
      )}
      onClick={onClick}
    >
      <Icon name={icon} size={16} />
      {title}
    </Button>
  )
}
