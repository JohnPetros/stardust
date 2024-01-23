import { Icon } from '@phosphor-icons/react'
import * as Toolbar from '@radix-ui/react-toolbar'

import { Tooltip } from '@/app/components/@Tooltip'

type ToolButtonProps = {
  icon: Icon
  label: string
}

export function ToolButton({ icon: Icon, label }: ToolButtonProps) {
  return (
    <Tooltip content={label} direction="bottom">
      <Toolbar.Button type="button">
        <Icon className="text-green-400" />
      </Toolbar.Button>
    </Tooltip>
  )
}
