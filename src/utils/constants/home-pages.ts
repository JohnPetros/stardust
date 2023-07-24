import { Icon } from '@phosphor-icons/react'

type HomePage = {
  path: string
  label: string
  icon: string
}

export const HOME_PAGES: HomePage[] = [
  {
    path: '/',
    label: 'Aprender',
    icon: 'learn.svg',
  },
  {
    path: '/challenges',
    label: 'Desafios',
    icon: 'challenges.svg',
  },
  {
    path: '/shop',
    label: 'Loja',
    icon: 'shop.svg',
  },
  {
    path: '/profile',
    label: 'Perfil',
    icon: 'profile.svg',
  },
  {
    path: '/ranking',
    label: 'Ranking',
    icon: 'ranking.svg',
  },
]
