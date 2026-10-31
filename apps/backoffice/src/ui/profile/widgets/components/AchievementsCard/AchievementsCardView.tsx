import { Button } from '@/ui/shadcn/components/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/ui/shadcn/components/alert-dialog'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { StorageImage } from '@/ui/global/widgets/components/StorageImage'
import type { AchievementDto } from '@stardust/core/profile/entities/dtos'
import { AchievementForm } from '../AchievementForm'

type Props = {
  achievement: AchievementDto
  onUpdate: (data: {
    name: string
    icon: string
    description: string
    reward: number
    requiredCount: number
    metric: string
  }) => void
  onDelete: () => void
}

export const AchievementsCardView = ({ achievement, onUpdate, onDelete }: Props) => {
  return (
    <div className='relative flex flex-col gap-4 rounded-xl border border-zinc-700 bg-zinc-900 p-4 shadow-sm transition-shadow hover:shadow-md'>
      <div className='absolute top-3 right-3 flex items-center gap-1'>
        <AchievementForm achievementDto={achievement} onSubmit={onUpdate}>
          <Button variant='ghost' size='icon' className='size-8 hover:bg-zinc-800'>
            <Icon
              name='edition'
              className='text-zinc-400 size-4 cursor-pointer hover:text-primary transition-colors'
            />
          </Button>
        </AchievementForm>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='ghost' size='icon' className='size-8 hover:bg-zinc-800'>
              <Icon
                name='trash'
                className='text-zinc-400 size-4 cursor-pointer hover:text-destructive transition-colors'
              />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Deletar Conquista</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja deletar a conquista?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Deletar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className='flex items-center gap-3 translate-x-8'>
        <StorageImage
          folder='achievements'
          src={achievement.icon}
          alt={achievement.name}
          className='w-12 h-12 shadow-md'
        />
        <div className='flex flex-col gap-1.5 w-full'>
          <h3 className='text-base font-semibold text-zinc-100'>{achievement.name}</h3>
          <p className='text-sm text-zinc-400 line-clamp-2 px-2 leading-relaxed'>
            {achievement.description}
          </p>
        </div>
      </div>
    </div>
  )
}
