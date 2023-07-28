'use client'
import { HOME_PAGES } from '@/utils/constants/home-pages'
import { NavButton } from './NavButton'

export function TabNav() {
  return (
    <div className="md:hidden fixed bottom-0 w-full border-t border-green-800 bg-gray-900 flex justify-center items-center px-6 py-3">
      <nav className="grid grid-flow-col auto-cols-fr w-full max-w-lg md:max-w-0">
        {HOME_PAGES.map(({ path, icon, label }) => (
          <NavButton key={path} path={path} label={label} icon={icon} />
        ))}
      </nav>
    </div>
  )
}
