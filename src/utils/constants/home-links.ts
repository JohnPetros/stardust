import { ROUTES } from './routes'

type HomeLink = {
  path: string
  label: string
  icon: string
}

export const HOME_LINKS: HomeLink[] = [
  {
    path: ROUTES.private.home.space,
    label: 'Aprender',
    icon: 'learn.svg',
  },
  {
    path: ROUTES.private.home.challenges,
    label: 'Desafios',
    icon: 'challenges.svg',
  },
  {
    path: ROUTES.private.home.shop,
    label: 'Loja',
    icon: 'shop.svg',
  },
  {
    path: ROUTES.private.home.profile,
    label: 'Perfil',
    icon: 'profile.svg',
  },
  {
    path: ROUTES.private.home.ranking,
    label: 'Ranking',
    icon: 'ranking.svg',
  },
]
