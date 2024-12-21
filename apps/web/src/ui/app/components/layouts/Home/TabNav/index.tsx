'use client'

import { NavLink } from '../NavLink'
import { HOME_LINKS } from '../home-links'

export function TabNav() {
  return (
    <div className='fixed bottom-0 flex w-full items-center justify-center border-t border-green-800 bg-gray-900 px-6 py-3 md:hidden'>
      <nav className='grid w-full grid-cols-5 md:max-w-0'>
        {HOME_LINKS.map(({ route, icon, label }) => (
          <NavLink key={route} route={route} label={label} icon={icon} />
        ))}
      </nav>
    </div>
  )
}
