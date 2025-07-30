import type { PropsWithChildren, RefObject } from 'react'

import FileUpload from '@/ui/shadcn/components/file-upload'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  type DialogRef,
} from '@/ui/shadcn/components/dialog'
import { InputWithError } from '@/ui/shadcn/components/input-with-error'
import { Button } from '@/ui/shadcn/components/button'
import { Icon } from '../Icon'

type Props = {
  dialogRef: RefObject<DialogRef | null>
  isSubmitting: boolean
  imageName: string
  isFilled: boolean
  imageNameError: string | null
  onFileChange: (file: File | null) => void
  onNameChange: (name: string) => void
  onSubmit: () => void
}

export const ImageInputView = ({
  dialogRef,
  children,
  isSubmitting,
  imageName,
  isFilled,
  imageNameError,
  onFileChange,
  onNameChange,
  onSubmit,
}: PropsWithChildren<Props>) => {
  return (
    <Dialog ref={dialogRef}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='p-10'>
        <div className='flex flex-col gap-6'>
          <FileUpload onFilesChange={(files) => onFileChange(files[0] ?? null)} />
          <InputWithError
            errorMessage={imageNameError}
            value={imageName}
            label='Nome da imagem'
            placeholder='pandinha.png'
            onChange={(event) => onNameChange(event.target.value)}
          />
          <Button
            disabled={!isFilled || isSubmitting}
            isLoading={isSubmitting}
            onClick={onSubmit}
            variant='outline'
            className='w-32 mx-auto'
          >
            <Icon name='submit' className='w-4 h-4' />
            Enviar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
