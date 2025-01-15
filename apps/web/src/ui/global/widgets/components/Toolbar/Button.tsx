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

export function ButtonComponent(
  { icon, label, className, onClick }: ToolButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <Tooltip content={label} direction='bottom'>
      <Toolbar.Button ref={ref} type='button' onClick={onClick}>
        <Icon name={icon} size={16} className={twMerge('text-green-400', className)} />
      </Toolbar.Button>
    </Tooltip>
  )
}

export const Button = forwardRef(ButtonComponent)
