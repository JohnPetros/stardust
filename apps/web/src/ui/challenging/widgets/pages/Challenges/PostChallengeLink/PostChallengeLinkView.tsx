import Link from 'next/link'

import { ROUTES } from '@/constants'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { StarBorder } from '@/ui/global/widgets/components/StarBorder'

export const PostChallengeLinkView = () => {
  return (
    <StarBorder>
      <Link
        href={ROUTES.challenging.challenge()}
        className='flex items-center w-max text-green-400 ml-auto text-sm'
      >
        Criar seu próprio desafio para outros usuários
        <Icon name='simple-arrow-right' size={16} />
      </Link>
    </StarBorder>
  )
}
