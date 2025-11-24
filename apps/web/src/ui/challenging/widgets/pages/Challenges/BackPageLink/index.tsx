'use client'

import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { BackPageLinkView } from './BackPageLinkView'

export const BackPageLink = () => {
  const { user } = useAuthContext()
  if (user) return <BackPageLinkView />
}
