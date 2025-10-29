import type { PropsWithChildren } from 'react'

import { Icon } from '@/ui/global/widgets/components/Icon'
import { StorageImage } from '@/ui/global/widgets/components/StorageImage'
import { Tooltip } from '@/ui/global/widgets/components/Tooltip'
import { AlertMessageComponent } from '@/ui/shadcn/components/alert-message-dialog'
import { ClipboardButton } from '@/ui/global/widgets/components/ClipboardButton'
import { cn } from '@/ui/shadcn/utils'

type Props = {
  imageName: string
  isSelected: boolean
  onClick: (imageName: string) => void
  onRemoveButtonClick: (imageName: string) => void
}

export const PictureCardView = ({
  imageName,
  isSelected,
  onClick,
  onRemoveButtonClick,
}: PropsWithChildren<Props>) => {
  return (
    <div
      className={cn(
        'relative flex items-center flex-col p-2 h-auto border rounded',
        isSelected ? 'border-zinc-400' : 'border-zinc-700',
      )}
    >
      <button
        type='button'
        className='p-2 hover:bg-zinc-800 rounded cursor-pointer'
        onClick={() => onClick(imageName)}
      >
        <StorageImage folder='story' src={imageName} alt='Imagem' className='w-32 h-32' />
      </button>
      <Tooltip content={imageName}>
        <ClipboardButton text={imageName} className='bg-transparent border-none'>
          <span className='truncate max-w-[150px]'>{imageName}</span>
        </ClipboardButton>
      </Tooltip>
      <AlertMessageComponent
        message='Você tem certeza que deseja remover esta imagem?'
        onConfirm={() => onRemoveButtonClick(imageName)}
      >
        <button
          type='button'
          className='absolute top-4 right-3 text-zinc-400 flex items-center gap-2 hover:opacity-80 rounded cursor-pointer'
        >
          <Icon name='trash' className='w-4 h-4' />
        </button>
      </AlertMessageComponent>
    </div>
  )
}
