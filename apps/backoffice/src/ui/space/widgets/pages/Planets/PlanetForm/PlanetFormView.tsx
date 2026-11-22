import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
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
import { usePlanetForm } from './usePlanetForm'
import type { PlanetDto } from '@stardust/core/space/entities/dtos'
import { ImageInput } from '@/ui/global/widgets/components/ImageInput'
import { FileStorageFolderPath } from '@stardust/core/storage/structures'
import type { PropsWithChildren } from 'react'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { useFileStorage } from '@/ui/global/hooks/useFileStorage'
import type { StorageService } from '@stardust/core/storage/interfaces'

const PLANETS_FOLDER = FileStorageFolderPath.createAsPlanets()

type Props = {
  planetDto?: PlanetDto
  storageService: StorageService
  onSubmit: (planetDto: Pick<PlanetDto, 'name' | 'image'>) => void
}

export const PlanetFormView = ({
  children,
  planetDto,
  storageService,
  onSubmit,
}: PropsWithChildren<Props>) => {
  const {
    form,
    planetImage,
    isSubmitting,
    isDialogOpen,
    handleSubmit,
    handleDialogChange,
  } = usePlanetForm({ planetDto, storageService, onSubmit })
  const imageUrl = useFileStorage(PLANETS_FOLDER, planetImage)

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Adicionar planeta</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id='planet-form' onSubmit={handleSubmit} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='Nome do planeta' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className='flex items-center justify-between'>
              <FormField
                control={form.control}
                name='image'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagem do planeta</FormLabel>
                    <FormControl>
                      <ImageInput folder={PLANETS_FOLDER.value} onSubmit={field.onChange}>
                        <Button
                          variant='ghost'
                          className='rounded-full border border-dashed mt-2 w-20 h-20'
                        >
                          {planetImage ? (
                            <img
                              src={imageUrl}
                              className='h-full w-full object-contain'
                              alt='Imagem do planeta'
                            />
                          ) : (
                            <Icon name='upload' />
                          )}
                        </Button>
                      </ImageInput>
                    </FormControl>
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
            form='planet-form'
            type='submit'
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {planetDto ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
