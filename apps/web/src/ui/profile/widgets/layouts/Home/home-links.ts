import { ROUTES } from '@/constants'

type HomeLink = {
  route: string
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
    route: ROUTES.app.home.challenges,
    label: 'Desafios',
    icon: 'challenges.svg',
  },
  {
    route: ROUTES.app.home.shop,
    label: 'Loja',
    icon: 'shop.svg',
  },
  {
    route: ROUTES.app.home.profile,
    label: 'Perfil',
    icon: 'profile.svg',
  },
  {
    route: ROUTES.app.home.ranking,
    label: 'Ranking',
    icon: 'ranking.svg',
  },
]
