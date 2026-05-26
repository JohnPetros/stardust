'use client'

import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { NavLinkView } from './NavLinkView'

type NavButtonProps = {
  route: string
  label: string
  icon: string
  isColumn?: boolean
  isExpanded?: boolean
}

export function NavLink({
  route,
  label,
  icon,
  isColumn = true,
  isExpanded = true,
}: NavButtonProps) {
  const router = useNavigationProvider()
  const isActive = router.currentRoute === route

  return (
    <NavLinkView
      route={route}
      label={label}
      icon={icon}
      isColumn={isColumn}
      isExpanded={isExpanded}
      isActive={isActive}
    />
  )
}
