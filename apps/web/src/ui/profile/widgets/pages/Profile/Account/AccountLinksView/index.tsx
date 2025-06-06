'use client'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { AccountLinksView } from './AccountLinksView'

type Props = {
  accountId: string
}

export const AccountLinks = ({ accountId }: Props) => {
  const { user } = useAuthContext()
  const isAccountUser = accountId === user?.id.value
  if (user)
    return (
      <AccountLinksView isAccountUser={isAccountUser} accountSlug={user.slug.value} />
    )
}
