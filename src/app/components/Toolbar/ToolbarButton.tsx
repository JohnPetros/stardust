import { Icon } from '@phosphor-icons/react'
import * as Toolbar from '@radix-ui/react-toolbar'

import { Tooltip } from '../Tooltip'

type ToolbarButtonProps = {
  icon: Icon
  children: string
  onClick?: VoidFunction
}

export function ToolbarButton({
  icon: Icon,
  children: tooltipContent,
  onClick,
}: ToolbarButtonProps) {
  return (
    <Toolbar.Button onClick={onClick} className="flex items-center">
      <Tooltip content={tooltipContent} direction="bottom">
        <Icon className=" text-green-400" weight="bold" />
      </Tooltip>
    </Toolbar.Button>
  )
}
