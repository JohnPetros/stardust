import Link from 'next/link'

import { ROUTES } from '@/constants'
import { AnimatedBorder } from '@/ui/global/widgets/components/AnimatedBorder'
import { Icon } from '@/ui/global/widgets/components/Icon'

export const PostChallengeLinkView = () => {
  return (
    <AnimatedBorder>
      <Link
        href={ROUTES.challenging.challenge()}
        className='flex items-center w-max text-green-400 px-3 ml-auto mt-3 text-sm'
      >
        Criar seu próprio desafio para outros usuários
        <Icon name='simple-arrow-right' size={16} />
      </Link>
    </AnimatedBorder>
  )
}
