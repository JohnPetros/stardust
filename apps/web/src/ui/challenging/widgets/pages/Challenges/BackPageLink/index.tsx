'use client'

import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { BackPageLinkView } from './BackPageLinkView'

export const BackPageLink = () => {
  const { account } = useAuthContext()
  return <BackPageLinkView isAccountAuthenticated={account?.isAuthenticated.isTrue ?? false} />
}
