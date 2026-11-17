'use client'

import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import type { IconName } from '@/ui/global/widgets/components/Icon/types'
import { NavLinkView } from './NavLinkView'

type NavButtonProps = {
  route: string
  label: string
  icon: IconName
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
