import { ROUTES } from './routes'

type HomePage = {
  path: string
  label: string
  icon: string
}

export const HOME_PAGES: HomePage[] = [
  {
    path: ROUTES.private.home,
    label: 'Aprender',
    icon: 'learn.svg',
  },
  {
    path: ROUTES.private.challenges,
    label: 'Desafios',
    icon: 'challenges.svg',
  },
  {
    path: ROUTES.private.shop,
    label: 'Loja',
    icon: 'shop.svg',
  },
  {
    path: ROUTES.private.profile,
    label: 'Perfil',
    icon: 'profile.svg',
  },
  {
    path: ROUTES.private.ranking,
    label: 'Ranking',
    icon: 'ranking.svg',
  },
]
