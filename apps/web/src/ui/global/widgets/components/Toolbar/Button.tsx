import * as Toolbar from '@radix-ui/react-toolbar'
import { twMerge, type ClassNameValue } from 'tailwind-merge'

import { Tooltip } from '../Tooltip'
import type { IconName } from '../Icon/types'
import { Icon } from '../Icon'

type ToolButtonProps = {
  icon: IconName
  label: string
  className?: ClassNameValue
  onClick: VoidFunction
}

export function Button({ icon, label, className, onClick }: ToolButtonProps) {
  return (
    <Tooltip content={label} direction='bottom'>
      <Toolbar.Button type='button' onClick={onClick}>
        <Icon name={icon} size={16} className={twMerge('text-green-400', className)} />
      </Toolbar.Button>
    </Tooltip>
  )
}
