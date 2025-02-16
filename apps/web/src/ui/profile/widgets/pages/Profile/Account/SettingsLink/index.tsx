'use client'

import { motion } from 'framer-motion'

import { ROUTES } from '@/constants'
import { Link } from '@/ui/auth/widgets/components/Link'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { Tooltip } from '@/ui/global/widgets/components/Tooltip'

type AccountLinksProps = {
  id: string
}

export function AccountLinks({ id }: AccountLinksProps) {
  const { user } = useAuthContext()

  const isAuthUser = id === user?.id

  if (isAuthUser)
    return (
      <ul className='flex items-center gap-3'>
        <li>
          <Link href={ROUTES.profile.settings(user.slug.value)}>
            <Tooltip direction='top' content='Configurações'>
              <motion.div whileHover={{ rotate: '90deg' }}>
                <Icon name='gear' className='text-green-500' />
              </motion.div>
            </Tooltip>
          </Link>
        </li>
        <li>
          <Link href={ROUTES.playground.snippets}>
            <Tooltip direction='top' content='Snippets de código'>
              <motion.div whileHover={{ rotate: '90deg' }}>
                <Icon name='snippet' className='text-green-500' />
              </motion.div>
            </Tooltip>
          </Link>
        </li>
      </ul>
    )
}
