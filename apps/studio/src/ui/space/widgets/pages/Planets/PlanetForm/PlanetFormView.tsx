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
import { StorageFolder } from '@stardust/core/storage/structures'
import type { PropsWithChildren } from 'react'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { useStorageImage } from '@/ui/global/hooks/useStorageImage'
import type { StorageService } from '@stardust/core/storage/interfaces'

const PLANETS_FOLDER = StorageFolder.createAsPlanets()

type Props = {
  planetDto?: PlanetDto
  storageService: StorageService 
  onSubmit: (planetDto: Pick<PlanetDto, 'name' | 'icon' | 'image'>) => void
}

export const PlanetFormView = ({
  children,
  planetDto,
  storageService,
  onSubmit,
}: PropsWithChildren<Props>) => {
  const { form, planetImage, planetIcon, isSubmitting, isDialogOpen, handleSubmit, handleDialogChange } = usePlanetForm({ planetDto, storageService, onSubmit })
  const imageUrl = useStorageImage(PLANETS_FOLDER, planetImage)
  const iconUrl = useStorageImage(PLANETS_FOLDER, planetIcon)

  console.log(planetImage)
  console.log(imageUrl)

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
                      <ImageInput
                        folder={PLANETS_FOLDER.name}
                        onSubmit={field.onChange}
                      >
                        <Button
                          variant='ghost'
                          className='rounded-full border border-dashed mt-2 w-20 h-20'
                        >
                          {planetImage ? (
                            <img
                              src={imageUrl}
                              className='h-full w-full object-contain'
                              alt='Icon'
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

              <FormField
                control={form.control}
                name='icon'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ícone do planeta</FormLabel>
                    <FormControl>
                      <ImageInput
                        folder={PLANETS_FOLDER.name}
                        onSubmit={field.onChange}
                      >
                        <Button
                          variant='ghost'
                          className='border border-dashed mt-2 w-48 h-12'
                        >
                         {planetIcon ? (
                          <div className='w-full h-full bg-primary'>
                            <img
                              src={iconUrl}
                              className='h-full w-full object-contain'
                              alt='Icon'
                            />
                          </div>
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
          <Button form='planet-form' type='submit' isLoading={isSubmitting} disabled={isSubmitting}>Criar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
