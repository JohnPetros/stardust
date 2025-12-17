import type { InsigniaDto } from '@stardust/core/shop/entities/dtos'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/shadcn/components/select'
import { Button } from '@/ui/shadcn/components/button'
import { useInsigniaForm } from './useInsigniaForm'
import type { PropsWithChildren } from 'react'
import { ImageInput } from '@/ui/global/widgets/components/ImageInput'
import { StorageFolder } from '@stardust/core/storage/structures'
import type { StorageService } from '@stardust/core/storage/interfaces'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { useStorageImage } from '@/ui/global/hooks/useStorageImage'

const INSIGNIAS_FOLDER = StorageFolder.createAsInsignias()

type Props = {
  storageService: StorageService
  onSubmit: (data: {
    name: string
    image: string
    price: number
    role: string
  }) => Promise<void>
  initialValues?: InsigniaDto
}

export const InsigniaFormView = ({
  children,
  storageService,
  onSubmit,
  initialValues,
}: PropsWithChildren<Props>) => {
  const {
    form,
    insigniaImage,
    isSubmitting,
    isDialogOpen,
    handleSubmit,
    handleDialogChange,
  } = useInsigniaForm({ storageService, onSubmit, initialValues })
  const imageUrl = useStorageImage(INSIGNIAS_FOLDER, insigniaImage)

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialValues ? 'Editar insígnia' : 'Criar insígnia'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id='insignia-form' onSubmit={handleSubmit} className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da insígnia</FormLabel>
                  <FormControl>
                    <Input placeholder='Insígnia espacial' {...field} />
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
                  <FormLabel>Imagem da insígnia</FormLabel>
                  <FormControl>
                    <ImageInput folder={INSIGNIAS_FOLDER.name} onSubmit={field.onChange}>
                      <Button
                        variant='ghost'
                        className='rounded-full border border-dashed mt-2 w-20 h-20'
                      >
                        {insigniaImage ? (
                          <img
                            src={imageUrl}
                            className='h-full w-full object-contain'
                            alt='Insignia'
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
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Papel</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione um papel' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='engineer'>Engenheiro espacial</SelectItem>
                      <SelectItem value='god'>Deus</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancelar</Button>
          </DialogClose>
          <Button
            form='insignia-form'
            type='submit'
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {initialValues ? 'Salvar' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
