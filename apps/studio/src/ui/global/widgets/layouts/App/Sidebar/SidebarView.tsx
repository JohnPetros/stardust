import { ROUTES } from '@/constants/routes'
import { Icon } from '../../../components/Icon'
import { NavigationLink } from '../NavigationLink'
import { NavigationTitle } from './NavigationTitle'

export const SidebarView = () => {
  return (
    <aside className='w-56 bg-zinc-950 border-r border-zinc-800 flex flex-col py-6 px-4 gap-6 text-zinc-200'>
      <nav className='flex flex-col gap-2'>
        <NavigationTitle>Dashboard</NavigationTitle>
        <NavigationLink
          href={ROUTES.dashboard}
          icon={<Icon name='dashboard' size={16} />}
        >
          Dashboard
        </NavigationLink>
      </nav>
      <div>
        <NavigationTitle>Perfis</NavigationTitle>
        <NavigationLink href={ROUTES.users} icon={<Icon name='user' size={16} />}>
          Usuários
        </NavigationLink>
        <NavigationLink
          href={ROUTES.achievements}
          icon={<Icon name='achievement' size={16} />}
        >
          Conquistas
        </NavigationLink>
      </div>
      <div>
        <NavigationTitle>Progresso espacial</NavigationTitle>
        <NavigationLink href={ROUTES.planets} icon={<Icon name='planet' size={16} />}>
          Planetas
        </NavigationLink>
      </div>
      <div>
        <NavigationTitle>Desafios de código</NavigationTitle>
        <NavigationLink
          href={ROUTES.challenges}
          icon={<Icon name='challenge' size={16} />}
        >
          Desafios
        </NavigationLink>
      </div>
    </aside>
  )
}
