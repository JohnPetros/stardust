import { Icon } from '@/ui/global/widgets/components/Icon'
import { StoryImage } from '@/ui/global/widgets/components/StoryImage'
import { Tooltip } from '@/ui/global/widgets/components/Tooltip'
import type { PropsWithChildren } from 'react'

type Props = {
  imageName: string
  onClick: (imageName: string) => void
  onCopyButtonClick: (imageName: string) => void
}

export const ImageCardView = ({
  imageName,
  onCopyButtonClick,
  onClick,
}: PropsWithChildren<Props>) => {
  return (
    <div className='flex items-center flex-col p-2 h-auto radius border border-zinc-700 rounded'>
      <button
        type='button'
        className='p-2 hover:bg-zinc-800 rounded cursor-pointer'
        onClick={() => onClick(imageName)}
      >
        <StoryImage src={imageName} alt='Imagem' className='w-32 h-32' />
      </button>
      <Tooltip content={imageName}>
        <button
          type='button'
          className='text-zinc-400 flex items-center gap-2 hover:opacity-80 rounded cursor-pointer'
          onClick={() => onCopyButtonClick(imageName)}
        >
          <Icon name='copy' className='w-4 h-4' />
          <p className='truncate max-w-[150px]'>{imageName}</p>
        </button>
      </Tooltip>
    </div>
  )
}
