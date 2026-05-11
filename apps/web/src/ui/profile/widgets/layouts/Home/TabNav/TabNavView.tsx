'use client'

import { NavLink } from '../NavLink'

type TabNavViewProps = {
  links: Array<{
    route: string
    label: string
    icon: string
  }>
}

export function TabNavView({ links }: TabNavViewProps) {
  return (
    <div className='fixed bottom-0 z-50 flex w-full items-center justify-center border-t border-green-800 bg-gray-900 px-6 py-3 md:hidden'>
      <nav className='grid w-full grid-cols-4 md:max-w-0'>
        {links.map(({ route, icon, label }) => (
          <NavLink key={label} route={route} label={label} icon={icon} />
        ))}
      </nav>
    </div>
  )
}
