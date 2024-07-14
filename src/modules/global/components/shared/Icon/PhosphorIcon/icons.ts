import {
  type Icon,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Envelope,
  EyeClosed,
  Prohibit,
  Check,
  SignIn,
  Eye,
  X,
  List,
  Lock,
  Power,
  Rocket,
  Flag,
  ArrowsDownUp,
} from '@phosphor-icons/react'

import type { IconName } from '../types/IconName'

export const ICONS: Record<IconName, Icon> = {
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up-down': ArrowsDownUp,
  'eye-closed': EyeClosed,
  'stop-sign': Prohibit,
  'sign-out': Power,
  achievement: Flag,
  menu: List,
  check: Check,
  enter: SignIn,
  eye: Eye,
  mail: Envelope,
  rocket: Rocket,
  home: Envelope,
  close: X,
  lock: Lock,
}
