import type { PropsWithChildren, ReactNode } from 'react'

import { Button } from '@/ui/shadcn/components/button'
import { PictureInput } from '../../../../components/PictureInput'
import type { Image } from '@stardust/core/global/structures'

type Props = {
  endContent: ReactNode
  hasPicture: boolean
  onClick: () => void
  onPictureInputChange: (picture: Image) => void
}

export const TextBlockButtonView = ({
  children,
  endContent,
  hasPicture,
  onClick,
  onPictureInputChange,
}: PropsWithChildren<Props>) => {
  return (
    <div className='flex items-center justify-between w-full rounded-md bg-zinc-800 shadow-sm text-zinc-300'>
      <Button variant='ghost' className='flex-1 justify-start py-6' onClick={onClick}>
        {children}
        {endContent}
      </Button>
      {hasPicture && <PictureInput onChange={onPictureInputChange} />}
    </div>
  )
}
