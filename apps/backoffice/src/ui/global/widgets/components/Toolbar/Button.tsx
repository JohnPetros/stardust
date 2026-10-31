import * as Toolbar from '@radix-ui/react-toolbar'
import { type ForwardedRef, forwardRef } from 'react'
import { twMerge, type ClassNameValue } from 'tailwind-merge'

import { Tooltip } from '../Tooltip'
import type { IconName } from '../Icon/types'
import { Icon } from '../Icon'

type ToolButtonProps = {
  icon: IconName
  label: string
  className?: ClassNameValue
  onClick?: VoidFunction
}

function ButtonComponent(
  { icon, label, className, onClick }: ToolButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <Tooltip content={label}>
      <Toolbar.Button
        ref={ref}
        type='button'
        onClick={onClick}
        className={twMerge(
          'p-2 hover:bg-gray-700 rounded-md transition-colors',
          className,
        )}
      >
        <Icon name={icon} size={16} className='text-zinc-100' />
      </Toolbar.Button>
    </Tooltip>
  )
}

export const Button = forwardRef(ButtonComponent)
