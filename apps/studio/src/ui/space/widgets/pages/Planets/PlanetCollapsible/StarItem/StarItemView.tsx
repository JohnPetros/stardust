import type { Star as StarEntity } from '@stardust/core/space/entities'

import { ROUTES } from '@/constants'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { Link } from '@/ui/global/widgets/components/Link'
import { Star } from '@/ui/global/widgets/components/Star'

type Props = {
  star: StarEntity
  isChallenge: boolean
}

export const StarItemView = ({ star, isChallenge }: Props) => {
  return (
    <div className='flex items-center gap-4 bg-zinc-800 rounded-lg py-1 px-4'>
      <Icon name='draggable' className='text-zinc-500' size={32} />
      <div className='-translate-x-3'>
        <Star number={star.number.value} size={80} />
      </div>
      <span className='text-base font-medium text-zinc-100 flex-1 -translate-x-6'>
        {star.name.value}
      </span>
      <div className='flex items-center gap-2 bg-zinc-900 rounded-lg p-2'>
        {isChallenge ? (
          <Link href={ROUTES.challenging.challenges} className='flex items-center gap-1'>
            <Icon name='challenge' className='text-zinc-400' size={16} />
            <span className='text-zinc-400 text-sm'>Desafio</span>
          </Link>
        ) : (
          <div className='flex items-center gap-6 '>
            <Link
              href={ROUTES.lesson.story(star.slug)}
              className='flex items-center gap-1'
            >
              <Icon name='history' className='text-zinc-400' size={16} />
              <span className='text-zinc-400 text-sm'>história</span>
              <Icon name='edition' className='text-zinc-400' size={14} />
            </Link>
            <Link
              href={ROUTES.lesson.questions(star.slug)}
              className='flex items-center gap-1'
            >
              <Icon name='questions' className='text-zinc-400' size={16} />
              <span className='text-zinc-400 text-sm'>Questões</span>
              <Icon name='edition' className='text-zinc-400' size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
