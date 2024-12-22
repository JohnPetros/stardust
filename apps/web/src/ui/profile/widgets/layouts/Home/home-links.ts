import { ROUTES } from '@/constants'

type HomeLink = {
  route: string
  label: string
  icon: string
}

export const HOME_LINKS: HomeLink[] = [
  {
    route: ROUTES.private.app.home.space,
    label: 'Aprender',
    icon: 'learn.svg',
  },
  {
    route: ROUTES.private.app.home.challenges,
    label: 'Desafios',
    icon: 'challenges.svg',
  },
  {
    route: ROUTES.private.app.home.shop,
    label: 'Loja',
    icon: 'shop.svg',
  },
  {
    route: ROUTES.private.app.home.profile,
    label: 'Perfil',
    icon: 'profile.svg',
  },
  {
    route: ROUTES.private.app.home.ranking,
    label: 'Ranking',
    icon: 'ranking.svg',
  },
]
