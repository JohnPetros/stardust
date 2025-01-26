'use client'

import { NavLink } from '../NavLink'
import { HOME_LINKS } from '../home-links'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

export function TabNav() {
  const { user } = useAuthContext()

  if (user)
    return (
      <div className='fixed bottom-0 flex w-full items-center justify-center border-t border-green-800 bg-gray-900 px-6 py-3 md:hidden z-50'>
        <nav className='grid w-full grid-cols-5 md:max-w-0'>
          {HOME_LINKS.map(({ route, icon, label }) => (
            <NavLink
              key={label}
              route={typeof route === 'function' ? route(user.slug.value) : route}
              label={label}
              icon={icon}
            />
          ))}
        </nav>
      </div>
    )
}
