import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from '@/ui/shadcn/components/form'
import { Input } from '@/ui/shadcn/components/input'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from '@/ui/shadcn/components/dialog'
import { Checkbox } from '@/ui/shadcn/components/checkbox'
import { Button } from '@/ui/shadcn/components/button'
import { ImageInput } from '@/ui/global/widgets/components/ImageInput'
import { StorageFolder } from '@stardust/core/storage/structures'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { useStorageImage } from '@/ui/global/hooks/useStorageImage'
import { useAvatarForm } from './useAvatarForm'

import type { PropsWithChildren } from 'react'

const AVATARS_FOLDER = StorageFolder.createAsAvatars()

type Props = {
  onSubmit: (data: {
    name: string
    image: string
    price: number
    isAcquiredByDefault?: boolean
    isSelectedByDefault?: boolean
  }) => void
}

export const AvatarFormView = ({ children, onSubmit }: PropsWithChildren<Props>) => {
  const {
    form,
    formImage,
    isSubmitting,
    isDialogOpen,
    handleSubmit,
    handleDialogChange,
  } = useAvatarForm({ onSubmit })

  const imageUrl = useStorageImage(AVATARS_FOLDER, formImage)

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar avatar</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id='avatar-form' onSubmit={handleSubmit} className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do avatar</FormLabel>
                  <FormControl>
                    <Input placeholder='Astronauta' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='image'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagem do avatar</FormLabel>
                  <FormControl>
                    <ImageInput folder={AVATARS_FOLDER.name} onSubmit={field.onChange}>
                      <Button
                        variant='ghost'
                        className='rounded-full border border-dashed mt-2 w-24 h-24 overflow-hidden p-0'
                        type='button'
                      >
                        {formImage ? (
                          <img
                            src={imageUrl}
                            className='h-full w-full object-cover'
                            alt='Preview'
                          />
                        ) : (
                          <Icon name='upload' />
                        )}
                      </Button>
                    </ImageInput>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='100'
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='isAcquiredByDefault'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border border-zinc-800 p-4'>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Adquirido por padrão</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='isSelectedByDefault'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border border-zinc-800 p-4'>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Selecionado por padrão</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancelar</Button>
          </DialogClose>
          <Button form='avatar-form' type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Criando...' : 'Criar avatar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
