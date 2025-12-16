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
import { Button } from '@/ui/shadcn/components/button'
import { useRocketForm } from './useRocketForm'
import type { PropsWithChildren } from 'react'
import { ImageInput } from '@/ui/global/widgets/components/ImageInput'
import { StorageFolder } from '@stardust/core/storage/structures'
import type { StorageService } from '@stardust/core/storage/interfaces'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { useStorageImage } from '@/ui/global/hooks/useStorageImage'
import { Checkbox } from '@/ui/shadcn/components/checkbox'

const ROCKETS_FOLDER = StorageFolder.createAsRockets()

type Props = {
  storageService: StorageService
  onSubmit: (data: {
    name: string
    image: string
    price: number
    isAcquiredByDefault?: boolean
    isSelectedByDefault?: boolean
  }) => Promise<void>
}

export const RocketFormView = ({
  children,
  storageService,
  onSubmit,
}: PropsWithChildren<Props>) => {
  const {
    form,
    rocketImage,
    isSubmitting,
    isDialogOpen,
    handleSubmit,
    handleDialogChange,
  } = useRocketForm({ storageService, onSubmit })
  const imageUrl = useStorageImage(ROCKETS_FOLDER, rocketImage)

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar foguete</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id='rocket-form' onSubmit={handleSubmit} className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do foguete</FormLabel>
                  <FormControl>
                    <Input placeholder='Foguete espacial' {...field} />
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
                  <FormLabel>Imagem do foguete</FormLabel>
                  <FormControl>
                    <ImageInput folder={ROCKETS_FOLDER.name} onSubmit={field.onChange}>
                      <Button
                        variant='ghost'
                        className='rounded-full border border-dashed mt-2 w-20 h-20'
                      >
                        {rocketImage ? (
                          <img
                            src={imageUrl}
                            className='h-full w-full object-contain'
                            alt='Rocket'
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

            <div className='flex flex-col gap-4'>
              <FormField
                control={form.control}
                name='isAcquiredByDefault'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>
                        Adquirido por padrão quando o usuário cria conta
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='isSelectedByDefault'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>
                        Selecionado por padrão quando o usuário cria conta
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancelar</Button>
          </DialogClose>
          <Button
            form='rocket-form'
            type='submit'
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
