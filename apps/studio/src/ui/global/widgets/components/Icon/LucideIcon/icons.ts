import {
  User,
  Flag,
  Globe,
  X as Close,
  Terminal,
  Star,
  Rocket,
  LayoutDashboard,
  SquarePen,
  GripVertical,
  Loader2,
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
  rocket: Rocket,
  loading: Loader2,
}
