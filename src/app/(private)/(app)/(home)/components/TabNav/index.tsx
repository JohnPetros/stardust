'use client'
import { NavButton } from '../NavButton'

import { HOME_LINKS } from '@/global/constants'

export function TabNav() {
  return (
    <div className="fixed bottom-0 flex w-full items-center justify-center border-t border-green-800 bg-gray-900 px-6 py-3 md:hidden">
      <nav className="grid w-full grid-cols-5 md:max-w-0">
        {HOME_LINKS.map(({ path, icon, label }) => (
          <NavButton key={path} path={path} label={label} icon={icon} />
        ))}
      </nav>
    </div>
  )
}
