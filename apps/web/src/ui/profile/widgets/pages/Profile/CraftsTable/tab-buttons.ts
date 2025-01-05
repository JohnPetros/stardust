import { ROUTES } from '@/constants'
import type { IconName } from '@/ui/global/widgets/components/Icon/types'

type TabValue = 'playground-tab' | 'challenges-tab' | 'solutions-tab'

type TabButtonType = {
  title: string
  link?: string
  icon: IconName
  value: TabValue
  canOrder: boolean
}

export const TAB_BUTTONS: TabButtonType[] = [
  {
    title: 'Códigos',
    link: ROUTES.playground,
    icon: 'file',
    value: 'playground-tab',
    canOrder: false,
  },
  {
    title: 'Desafios',
    link: ROUTES.challenging.challengess,
    icon: 'terminal',
    value: 'challenges-tab',
    canOrder: true,
  },
]
