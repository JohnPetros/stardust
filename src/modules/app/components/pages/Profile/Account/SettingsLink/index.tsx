'use client'

import { motion } from 'framer-motion'

import { Link } from '@/modules/auth/components/shared/Link'
import { ROUTES } from '@/modules/global/constants'
import { Icon } from '@/modules/global/components/shared/Icon'
import { useAuthContext } from '@/modules/global/contexts/AuthContext'

type SettingsLinkProps = {
  id: string
}

export function SettingsLink({ id }: SettingsLinkProps) {
  const { user } = useAuthContext()

  const isAuthUser = id === user?.id

  if (isAuthUser)
    return (
      <Link href={ROUTES.private.app.profileSettings}>
        <motion.div whileHover={{ rotate: '90deg' }}>
          <Icon name='gear' className='hidden text-4xl text-green-500 md:block' />
        </motion.div>
      </Link>
    )
}