'use client'

import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { GoToProfilePageLinkView } from './GoProfilePageLinkView'

export const GoToProfilePageLink = () => {
  const { user } = useAuthContext()

  if (user) return <GoToProfilePageLinkView userSlug={user.slug.value} />
}
