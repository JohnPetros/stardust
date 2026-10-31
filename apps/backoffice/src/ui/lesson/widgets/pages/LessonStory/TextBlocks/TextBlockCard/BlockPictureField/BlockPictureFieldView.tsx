import type { Image } from '@stardust/core/global/structures'

import { PictureInput } from '@/ui/lesson/widgets/components/PictureInput'
import { Button } from '@/ui/shadcn/components/button'
import { Label } from '@/ui/shadcn/components/label'

type Props = {
  picture?: Image
  isRequired?: boolean
  onChange: (picture?: string) => void
}

export const BlockPictureFieldView = ({
  picture,
  isRequired = false,
  onChange,
}: Props) => {
  return (
    <div className='space-y-2'>
      <Label>{isRequired ? 'Imagem *' : 'Imagem'}</Label>
      <div className='flex items-center gap-2'>
        <PictureInput
          defaultPicture={picture}
          isOptional={!isRequired}
          onChange={(nextPicture) => onChange(nextPicture.value)}
          onClear={isRequired ? undefined : () => onChange(undefined)}
        />
        {picture && !isRequired && (
          <Button
            type='button'
            variant='ghost'
            className='h-7 px-2 text-xs text-zinc-400 hover:text-zinc-200'
            onClick={() => onChange(undefined)}
          >
            Remover imagem
          </Button>
        )}
      </div>
    </div>
  )
}
