import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from '@/ui/shadcn/components/form'
import { Input } from '@/ui/shadcn/components/input'
import { Textarea } from '@/ui/shadcn/components/textarea'
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
import { useAchievementForm } from './useAchievementForm'
import type { PropsWithChildren } from 'react'
import { ImageInput } from '@/ui/global/widgets/components/ImageInput'
import { StorageFolder } from '@stardust/core/storage/structures'
import type { StorageService } from '@stardust/core/storage/interfaces'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { useStorageImage } from '@/ui/global/hooks/useStorageImage'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/shadcn/components/select'
import type { AchievementDto } from '@stardust/core/profile/entities/dtos'

const ACHIEVEMENTS_FOLDER = StorageFolder.createAsAchievements()

const METRIC_LABELS: Record<string, string> = {
  unlockedStarsCount: 'Estrelas Desbloqueadas',
  acquiredRocketsCount: 'Foguetes Adquiridos',
  completedChallengesCount: 'Desafios Completados',
  completedPlanetsCount: 'Planetas Completados',
  xp: 'XP',
  streak: 'Streak (Dias seguidos)',
}

const METRIC_OPTIONS = [
  'unlockedStarsCount',
  'acquiredRocketsCount',
  'completedChallengesCount',
  'completedPlanetsCount',
  'xp',
  'streak',
] as const

type Props = {
  achievementDto?: AchievementDto
  storageService: StorageService
  onSubmit: (data: {
    name: string
    icon: string
    description: string
    reward: number
    requiredCount: number
    metric: string
  }) => void
}

export const AchievementFormView = ({
  children,
  achievementDto,
  storageService,
  onSubmit,
}: PropsWithChildren<Props>) => {
  const {
    form,
    achievementIcon,
    isSubmitting,
    isDialogOpen,
    handleSubmit,
    handleDialogChange,
    isEditMode,
  } = useAchievementForm({ achievementDto, storageService, onSubmit })
  const iconUrl = useStorageImage(ACHIEVEMENTS_FOLDER, achievementIcon)

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Editar conquista' : 'Adicionar conquista'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id='achievement-form' onSubmit={handleSubmit} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da conquista</FormLabel>
                  <FormControl>
                    <Input placeholder='Desenvolvedor da semana' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='icon'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ícone da conquista</FormLabel>
                  <FormControl>
                    <ImageInput
                      folder={ACHIEVEMENTS_FOLDER.name}
                      onSubmit={field.onChange}
                    >
                      <Button
                        variant='ghost'
                        className='rounded-full border border-dashed mt-2 w-20 h-20'
                      >
                        {achievementIcon ? (
                          <img
                            src={iconUrl}
                            className='h-full w-full object-contain'
                            alt='Icon'
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
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição da conquista</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Desbloqueie 1000 conquistas' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='reward'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recompensa da conquista</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Recompensa'
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
                name='requiredCount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contagem mínima exigida</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Contagem mínima'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='metric'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Métrica da conquista</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione uma métrica' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {METRIC_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {METRIC_LABELS[option]}
                        </SelectItem>
                      ))}
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
            form='achievement-form'
            type='submit'
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isEditMode ? 'Salvar' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
