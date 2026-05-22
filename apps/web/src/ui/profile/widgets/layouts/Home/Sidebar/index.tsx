'use client'

import { useSiderbarContext } from '@/ui/profile/contexts/SidebarContext'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { ROUTES } from '@/constants'
import { SidebarView } from './SidebarView'

export const Sidebar = () => {
  const { user } = useAuthContext()
  const { goTo } = useNavigationProvider()
  const { isOpen, toggle } = useSiderbarContext()

  if (user)
    return (
      <SidebarView
        isOpen={isOpen}
        toggle={toggle}
        onNotesClick={() => goTo(ROUTES.notes)}
        user={{
          name: user.name.value,
          email: user.email.value,
          avatar: {
            image: user.avatar.image.value,
            name: user.avatar.name.value,
          },
        }}
      />
    )
}
