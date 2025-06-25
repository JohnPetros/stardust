import { ROUTES } from '@/constants'

type HomeLink = {
  route: string | ((param: string) => string)
  label: string
  icon: string
}

export const HOME_LINKS: HomeLink[] = [
  {
    route: ROUTES.space,
    label: 'Aprender',
    icon: 'learn.svg',
  },
  {
    route: ROUTES.challenging.challenges.list,
    label: 'Desafios',
    icon: 'challenges.svg',
  },
  {
    route: ROUTES.shop,
    label: 'Loja',
    icon: 'shop.svg',
  },
  {
    route: ROUTES.profile.user,
    label: 'Perfil',
    icon: 'profile.svg',
  },
  // {
  //   route: ROUTES.ranking,
  //   label: 'Ranking',
  //   icon: 'ranking.svg',
  // },
] as const
