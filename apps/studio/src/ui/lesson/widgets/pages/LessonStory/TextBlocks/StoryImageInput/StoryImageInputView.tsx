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
          className='block space-y-4 min-h-[80vh] max-h-[80vh] overflow-y-auto bg-zinc-900 min-w-3xl'
        >
          <DialogHeader>
            <DialogTitle>Selecione uma imagem</DialogTitle>
          </DialogHeader>

          <div className='flex items-center justify-between gap-6'>
            <Input
              placeholder='Pesquise por uma imagem'
              onChange={(event) => onSearchInputChange(event.target.value)}
            />
            <div className='flex items-center justify-between gap-2 px-3 py-1 w-56 border border-zinc-700 rounded text-sm text-zinc-300'>
              Selecionado
              <StoryImage src={selectedImage} alt='Imagem' className='w-10 h-8' />
            </div>
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
