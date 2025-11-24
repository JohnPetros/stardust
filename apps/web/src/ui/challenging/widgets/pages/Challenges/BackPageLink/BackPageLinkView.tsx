import Link from 'next/link'

import { ROUTES } from '@/constants'
import { Icon } from '@/ui/global/widgets/components/Icon'

export const BackPageLinkView = () => {
  return (
    <Link href={ROUTES.space} className='absolute -top-8 text-green-400'>
      <Icon name='arrow-left' />
    </Link>
  )
}
