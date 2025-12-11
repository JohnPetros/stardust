import Link from 'next/link'

import { ROUTES } from '@/constants'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { StarBorder } from '@/ui/global/widgets/components/StarBorder'

type Props = {
  isAccountAuthenticated: boolean
}

export const BackPageLinkView = ({ isAccountAuthenticated }: Props) => {
  if (isAccountAuthenticated) {
    return (
      <Link href={ROUTES.space} className='text-green-400'>
        <Icon name='arrow-left' />
      </Link>
    )
  }
  return (
    <StarBorder>
      <Link
        href={ROUTES.auth.signIn}
        className='flex items-center w-max text-green-400 ml-auto text-sm'
      >
        Acessar a sua conta
      </Link>
    </StarBorder>
  )
}
