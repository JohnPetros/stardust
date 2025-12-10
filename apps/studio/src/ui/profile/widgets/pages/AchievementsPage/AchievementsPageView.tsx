import type { AchievementDto } from '@stardust/core/profile/entities/dtos'
import { AchievementForm } from '../../components/AchievementForm'
import { AchievementsCard } from '../../components/AchievementsCard'
import { Button } from '@/ui/shadcn/components/button'

type Props = {
  achievements: AchievementDto[]
  onCreateAchievement: (data: {
    name: string
    icon: string
    description: string
    reward: number
    requiredCount: number
    metric: string
  }) => void
  onUpdate: (
    achievement: AchievementDto,
    data: {
      name: string
      icon: string
      description: string
      reward: number
      requiredCount: number
      metric: string
    },
  ) => void
  onDelete: (achievement: AchievementDto) => void
}

export const AchievementsPageView = ({
  achievements,
  onCreateAchievement,
  onUpdate,
  onDelete,
}: Props) => {
  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-2xl font-bold text-zinc-100'>Conquistas</h1>
          <p className='text-sm text-zinc-400'>
            Gerencie todas as conquistas cadastradas no sistema
          </p>
        </div>
        <AchievementForm onSubmit={onCreateAchievement}>
          <Button>Adicionar Conquista</Button>
        </AchievementForm>
      </div>
      <div className='grid grid-cols-3 gap-4'>
        {achievements.map((achievement) => (
          <AchievementsCard
            key={achievement.id}
            achievement={achievement}
            onUpdate={(data) => onUpdate(achievement, data)}
            onDelete={() => onDelete(achievement)}
          />
        ))}
      </div>
    </div>
  )
}
