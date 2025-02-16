import type { ReactNode } from 'react'

export type PopoverMenuButton = {
  isToggle: boolean
  title?: string
  label?: string
  icon?: ReactNode
  value?: boolean | null
  action: VoidFunction
}
