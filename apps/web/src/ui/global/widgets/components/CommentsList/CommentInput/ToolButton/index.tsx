import * as Toolbar from '@radix-ui/react-toolbar'
import { Tooltip } from '../../../Tooltip'
import type { IconName } from '../../../Icon/types'
import { Icon } from '../../../Icon/'

type ToolButtonProps = {
  icon: IconName
  label: string
  onClick: VoidFunction
}

export function ToolButton({ icon, label, onClick }: ToolButtonProps) {
  return (
    <Tooltip content={label} direction='bottom'>
      <Toolbar.Button type='button' onClick={onClick}>
        <Icon name={icon} size={16} className='text-green-400' />
      </Toolbar.Button>
    </Tooltip>
  )
}
