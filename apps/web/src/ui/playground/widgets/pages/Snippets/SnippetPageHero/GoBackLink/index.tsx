'use client'

import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { GoBackLinkView } from './GoBackLinkView'

export const GoBackLink = () => {
  const { user } = useAuthContext()

  if (user) return <GoBackLinkView userSlug={user.slug.value} />
}
