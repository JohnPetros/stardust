import {
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
  Lock,
  Icon,
  Rocket,
} from '@phosphor-icons/react'

import type { IconName } from '../types/IconName'

export const ICONS: Record<IconName, Icon> = {
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'eye-closed': EyeClosed,
  'stop-sign': Prohibit,
  check: Check,
  enter: SignIn,
  eye: Eye,
  mail: Envelope,
  rocket: Rocket,
  home: Envelope,
  close: X,
  lock: Lock,
}
