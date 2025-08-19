import Link from 'next/link'

import { ROUTES } from '@/constants'
import { Icon } from '@/ui/global/widgets/components/Icon'

type Props = {
  userSlug: string
}

export const GoToProfilePageLinkView = ({ userSlug }: Props) => {
  return (
    <Link href={ROUTES.profile.user(userSlug)} className='text-green-400'>
      <Icon name='arrow-left' />
    </Link>
  )
}
