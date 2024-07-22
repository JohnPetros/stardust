import type { IconName } from '@/modules/global/components/shared/Icon/types'
import { ROUTES } from '@/modules/global/constants'

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
    link: ROUTES.private.app.playground,
    icon: 'file',
    value: 'playground-tab',
    canOrder: false,
  },
  {
    title: 'Desafios',
    link: ROUTES.private.app.home.challenges,
    icon: 'terminal',
    value: 'challenges-tab',
    canOrder: true,
  },
]