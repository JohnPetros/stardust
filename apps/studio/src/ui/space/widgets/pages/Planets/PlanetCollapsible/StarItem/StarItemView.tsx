import type { Star as StarEntity } from '@stardust/core/space/entities'

import { ROUTES } from '@/constants'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { Link } from '@/ui/global/widgets/components/Link'
import { Star } from '@/ui/global/widgets/components/Star'
import { Toggle } from '@/ui/global/widgets/components/Toggle'
import { Button } from '@/ui/shadcn/components/button'
import { ConfirmDialog } from '@/ui/global/widgets/components/ConfirmDialog'
import { ExpandableInput } from '@/ui/lesson/widgets/components/ExpandableInput'
import { Tooltip } from '@/ui/global/widgets/components/Tooltip'
import { StarUserIcon } from './StarUserIcon'
import { StarUnlockIcon } from './StarUnlockIcon'

type Props = {
  star: StarEntity
  isChallenge: boolean
  onNameChange: (name: string) => void
  onAvailabilityChange: (isAvailable: boolean) => void
  onTypeChange: (isChallenge: boolean) => void
  onChallengeClick: () => void
  onDelete: (starId: string) => void
}

export const StarItemView = ({
  star,
  isChallenge,
  onNameChange,
  onAvailabilityChange,
  onTypeChange,
  onChallengeClick,
  onDelete,
}: Props) => {
  return (
    <div className='flex items-center gap-4 bg-transparent w-full rounded-lg py-1 px-4 pl-12'>
      <div className=''>
        <Star number={star.number.value} size={80} />
      </div>
      <div className='flex-1'>
        <ExpandableInput defaultValue={star.name.value} onBlur={onNameChange} />
      </div>
      <div className='flex items-center gap-2 bg-zinc-900 rounded-lg px-4 py-2'>
        {isChallenge ? (
          <button
            type='button'
            onClick={onChallengeClick}
            className='flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-none'
          >
            <Icon name='challenge' className='text-zinc-400' size={16} />
            <span className='text-zinc-400 text-sm'>Desafio</span>
            <Icon name='edition' className='text-zinc-400' size={14} />
          </button>
        ) : (
          <div className='flex items-center gap-6'>
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

      <Tooltip content='Quantidade de usuários que pararam nesta estrela'>
        <div className='flex items-center gap-2 text-sm'>
          <span>{star.userCount.value}</span>
          <StarUserIcon className='text-zinc-400 w-4 h-5' />
        </div>
      </Tooltip>

      <Tooltip content='Quantidade de usuários que desbloquearam esta estrela'>
        <div className='flex items-center gap-2 text-sm'>
          <span>{star.unlockCount.value}</span>
          <StarUnlockIcon className='text-zinc-400 w-4 h-4' />
        </div>
      </Tooltip>

      <Toggle
        label='Disponível para os usuários?'
        defaultChecked={star.isAvailable.value}
        onCheck={onAvailabilityChange}
      />
      <Toggle
        label='É um desafio?'
        defaultChecked={star.isChallenge.value}
        onCheck={onTypeChange}
      />
      <ConfirmDialog
        title='Tem certeza que deseja excluir esta estrela deste planeta?'
        description='Esta ação não pode ser desfeita.'
        onConfirm={() => onDelete(star.id.value)}
      >
        <Button variant='ghost' size='icon'>
          <Icon name='trash' className='text-zinc-400' size={16} />
        </Button>
      </ConfirmDialog>
    </div>
  )
}
