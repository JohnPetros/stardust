'use client'

import { HOME_LINKS } from '../home-links'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { TabNavView } from './TabNavView'

export function TabNav() {
  const { user } = useAuthContext()

  if (!user) return null

  const links = HOME_LINKS.map(({ route, icon, label }) => ({
    route: typeof route === 'function' ? route(user.slug.value) : route,
    label,
    icon,
  }))

  return <TabNavView links={links} />
}
