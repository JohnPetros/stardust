import type { RefObject } from 'react'
import type { Image } from '@stardust/core/global/structures'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  type DialogRef,
} from '@/ui/shadcn/components/dialog'
import { Input } from '@/ui/shadcn/components/input'
import { PictureCard } from './PictureCard'
import { Button } from '@/ui/shadcn/components/button'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { ImageInput } from '@/ui/global/widgets/components/ImageInput'
import { Loading } from '@/ui/global/widgets/components/Loading'
import { LoadMoreButton } from '@/ui/global/widgets/components/LoadMoreButton'
import { StorageImage } from '@/ui/global/widgets/components/StorageImage'

type Props = {
  dialogRef: RefObject<DialogRef | null>
  selectedImage: string
  images: Image[]
  isFetching: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  onPictureCardClick: (imageName: string) => void
  onSearchInputChange: (search: string) => void
  onLoadMoreButtonClick: () => void
  onPictureCardRemove: () => void
  onSubmitImage: () => void
}

export const PictureInputView = ({
  dialogRef,
  selectedImage,
  images,
  isFetching,
  isFetchingNextPage,
  hasNextPage,
  onPictureCardClick,
  onSearchInputChange,
  onLoadMoreButtonClick,
  onPictureCardRemove,
  onSubmitImage,
}: Props) => {
  return (
    <Dialog ref={dialogRef}>
      <DialogTrigger className='cursor-pointer'>
        <StorageImage
          folder='story'
          src={selectedImage}
          alt='Imagem'
          className='w-12 h-10'
        />
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
            <StorageImage
              folder='story'
              src={selectedImage}
              alt='Imagem'
              className='w-10 h-8'
            />
          </div>
          <ImageInput folder='story' onSubmit={onSubmitImage}>
            <Button variant='outline' className='flex items-center gap-2'>
              <Icon name='upload' className='w-4 h-4' />
              Adicionar
            </Button>
          </ImageInput>
        </div>

        <div className='w-full'>
          {isFetching && !isFetchingNextPage && (
            <div className='grid place-content-center h-[50vh]'>
              <Loading />
            </div>
          )}

          {images.length > 0 && (
            <ul className='grid grid-cols-3 gap-6'>
              {images.map((image) => (
                <li key={image.value}>
                  <PictureCard
                    key={image.value}
                    isSelected={image.value === selectedImage}
                    imageName={image.value}
                    onClick={onPictureCardClick}
                    onRemove={onPictureCardRemove}
                  />
                </li>
              ))}
            </ul>
          )}

          {!isFetching && images.length === 0 && (
            <div className='grid place-content-center h-[50vh]'>
              <p className='text-zinc-300'>Nenhuma imagem encontrada</p>
            </div>
          )}

          {hasNextPage && (
            <div className='flex justify-center'>
              <LoadMoreButton
                isLoading={isFetchingNextPage}
                onClick={onLoadMoreButtonClick}
                className='mt-10 w-64'
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
