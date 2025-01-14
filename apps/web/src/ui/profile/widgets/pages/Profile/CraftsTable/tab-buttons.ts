import { ROUTES } from '@/constants'
import type { IconName } from '@/ui/global/widgets/components/Icon/types'
import type { TabContent } from './TabContent'

type TabButtonType = {
  title: string
  link?: string
  icon: IconName
  value: TabContent
}

export const TAB_BUTTONS: TabButtonType[] = [
  {
    title: 'Códigos',
    link: ROUTES.playground,
    icon: 'file',
    value: 'snippets-tab',
  },
  {
    title: 'Desafios',
    link: ROUTES.challenging.challenges.list,
    icon: 'terminal',
    value: 'challenges-tab',
  },
]
