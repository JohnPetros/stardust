'use client'

import { useRef } from 'react'
import { Icon } from '@phosphor-icons/react'
import * as ToolBar from '@radix-ui/react-toolbar'

import { Tooltip, TooltipContent, TooltipRef } from '@/app/components/Tooltip'

type ToolProps = {
  icon: Icon
  label: string
}

export function Tool({ icon: Icon, label }: ToolProps) {
  const tooltipRef = useRef<TooltipRef>(null)

  return (
    <Tooltip>
      <ToolBar.Button className="grid place-content-center">
        <Icon className="text-xl text-green-500" weight="bold" />
      </ToolBar.Button>

      <TooltipContent ref={tooltipRef} text={label} direction="bottom" />
    </Tooltip>
  )
}
