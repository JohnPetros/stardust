import type { PropsWithChildren } from 'react'

import type { Image } from '@stardust/core/global/structures'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/shadcn/components/dialog'
import { Input } from '@/ui/shadcn/components/input'
import { ImageCard } from './ImageCard'
import { StoryImage } from '@/ui/global/widgets/components/StoryImage'
import { Button } from '@/ui/shadcn/components/button'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { ImageInput } from '@/ui/global/widgets/components/ImageInput'

type Props = {
  selectedImage: string
  images: Image[]
  onClick: (imageName: string) => void
  onSearchInputChange: (search: string) => void
}

export const StoryImageInputView = ({
  selectedImage,
  images,
  onClick,
  onSearchInputChange,
}: PropsWithChildren<Props>) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <StoryImage src={selectedImage} alt='Imagem' className='w-12 h-10' />
        </DialogTrigger>
        <DialogContent
          showCloseButton
          className='block space-y-4 min-h-[80vh] max-h-[80vh] overflow-y-auto min-w-3xl'
        >
          <DialogHeader>
            <DialogTitle>Selecione uma imagem</DialogTitle>
          </DialogHeader>

          <div className='flex items-center justify-between gap-6'>
            <Input
              placeholder='Pesquise por uma imagem'
              onChange={(event) => onSearchInputChange(event.target.value)}
            />
            <div className='flex items-center justify-between gap-2 px-3 py-1 w-64 border border-zinc-700 rounded text-sm text-zinc-300'>
              Selecionado:
              <StoryImage src={selectedImage} alt='Imagem' className='w-10 h-8' />
            </div>
            <ImageInput folder='story'>
              <Button variant='outline' className='flex items-center gap-2'>
                <Icon name='upload' className='w-4 h-4' />
                Adicionar
              </Button>
            </ImageInput>
          </div>

          <div>
            <ul className='grid grid-cols-3 gap-6'>
              {images.map((image) => (
                <li key={image.value}>
                  <ImageCard
                    key={image.value}
                    imageName={image.value}
                    onClick={onClick}
                  />
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
