import type { ReactNode } from 'react'
import { NavLink } from 'react-router'

import { cn } from '@/ui/shadcn/utils'

type Props = {
  href: string
  children: ReactNode
  icon?: ReactNode
  className?: string
}

export const NavigationLinkView = ({ href, children, icon, className = '' }: Props) => {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2 px-2 py-2 rounded hover:bg-zinc-800 transition-colors',
          isActive && 'bg-zinc-800',
          className,
        )
      }
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </NavLink>
  )
}
