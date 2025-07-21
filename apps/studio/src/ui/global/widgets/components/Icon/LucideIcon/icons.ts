import {
  User,
  Flag,
  Globe,
  X as Close,
  Terminal,
  Star,
  LayoutDashboard,
  SquarePen,
  GripVertical,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react'

import type { IconName } from '../types/IconName'

export const ICONS: Record<IconName, LucideIcon> = {
  'arrow-down': ChevronDown,
  user: User,
  achievement: Flag,
  planet: Globe,
  challenge: Terminal,
  dashboard: LayoutDashboard,
  x: Close,
  edition: SquarePen,
  star: Star,
  draggable: GripVertical,
}
