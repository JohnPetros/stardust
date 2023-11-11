'use client'

import { RefObject } from 'react'
import { Icon } from '@phosphor-icons/react'
import * as ToolBar from '@radix-ui/react-toolbar'

interface IconButtonProps {
  icon: Icon
}

export function IconButton({ icon: Icon }: IconButtonProps) {
  return (
    <ToolBar.Button className="grid place-content-center">
      <Icon className="text-xl text-green-500" weight="bold" />
    </ToolBar.Button>
  )
}
