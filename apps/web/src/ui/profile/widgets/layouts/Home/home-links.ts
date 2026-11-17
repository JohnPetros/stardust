import { ROUTES } from '@/constants'
import type { IconName } from '@/ui/global/widgets/components/Icon/types'

type HomeLink = {
  route: string | ((param: string) => string)
  label: string
  icon: IconName
}

export const HOME_LINKS: HomeLink[] = [
  {
    route: ROUTES.space,
    label: 'Aprender',
    icon: 'graduation-cap',
  },
  {
    route: ROUTES.challenging.challenges.list,
    label: 'Desafios',
    icon: 'terminal',
  },
  {
    route: ROUTES.shop,
    label: 'Loja',
    icon: 'store',
  },
  {
    route: ROUTES.profile.user,
    label: 'Perfil',
    icon: 'person',
  },
  // {
  //   route: ROUTES.ranking,
  //   label: 'Ranking',
  //   icon: 'ranking.svg',
  // },
] as const
