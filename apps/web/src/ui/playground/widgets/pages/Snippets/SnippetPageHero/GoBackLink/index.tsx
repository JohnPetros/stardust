'use client'

import Link from 'next/link'

import { ROUTES } from '@/constants'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { Icon } from '@/ui/global/widgets/components/Icon'

export function GoBackLink() {
  const { user } = useAuthContext()

  if (user)
    return (
      <Link href={ROUTES.profile.user(user.slug.value)} className='text-green-400'>
        <Icon name='arrow-left' />
      </Link>
    )
}
