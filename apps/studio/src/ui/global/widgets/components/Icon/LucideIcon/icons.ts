import {
  User,
  Flag,
  Globe,
  X as Close,
  Terminal,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react'

import type { IconName } from '../types/IconName'

export const ICONS: Record<IconName, LucideIcon> = {
  user: User,
  achievement: Flag,
  planet: Globe,
  challenge: Terminal,
  dashboard: LayoutDashboard,
  x: Close,
}
