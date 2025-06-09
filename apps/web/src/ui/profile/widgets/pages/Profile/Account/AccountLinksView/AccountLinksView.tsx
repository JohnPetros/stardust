import { motion } from 'framer-motion'

import { ROUTES } from '@/constants'
import { Link } from '@/ui/auth/widgets/components/Link'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { Tooltip } from '@/ui/global/widgets/components/Tooltip'

type Props = {
  isAccountUser: boolean
  accountSlug: string
}

export const AccountLinksView = ({ isAccountUser, accountSlug }: Props) => {
  if (isAccountUser)
    return (
      <ul className='flex items-center gap-3'>
        <li>
          <Link href={ROUTES.profile.settings(accountSlug)}>
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
