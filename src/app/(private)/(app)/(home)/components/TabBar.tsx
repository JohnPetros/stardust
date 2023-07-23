import { HOME_PAGES } from '@/constants/home-pages'
import { NavButton } from './NavButton'

export function TabBar() {
  return (
    <div className="fixed bottom-0 w-full border-t border-green-800 bg-gray-900 flex justify-center items-center">
      <nav className="flex items-center justify-between gap-2">
        {HOME_PAGES.map(({ path, icon, label }) => (
          <NavButton path={path} label={label} icon={icon} isActive={false} />
        ))}
      </nav>
    </div>
  )
}
