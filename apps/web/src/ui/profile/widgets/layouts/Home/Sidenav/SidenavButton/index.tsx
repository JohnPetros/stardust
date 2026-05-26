'use client'

import type { ReactNode } from 'react'

import type { IconName } from '@/ui/global/widgets/components/Icon/types'
import { SidenavButtonView } from './SidenavButtonView'

type SidenavButtonProps = {
  icon: IconName
  title: string
  isExpanded: boolean
  isActive: boolean
  countBadge?: ReactNode
  onClick: VoidFunction
}

export function SidenavButton({
  icon,
  title,
  isExpanded,
  isActive,
  countBadge,
  onClick,
}: SidenavButtonProps) {
  return (
    <SidenavButtonView
      icon={icon}
      title={title}
      isExpanded={isExpanded}
      isActive={isActive}
      countBadge={countBadge}
      onClick={onClick}
    />
  )
}
