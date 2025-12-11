import type { AchievementDto } from '@stardust/core/profile/entities/dtos'
import { AchievementForm } from '../../components/AchievementForm'
import { AchievementsCard } from '../../components/AchievementsCard'
import { Button } from '@/ui/shadcn/components/button'
import { SortableGrid } from '@/ui/global/widgets/components/SortableGrid'
import type { SortableItem } from '@/ui/global/widgets/components/SortableGrid/types'

type Props = {
  achievements: SortableItem<AchievementDto>[]
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
  onDragEnd: (reorderedAchievements: SortableItem<AchievementDto>[]) => void
}

export const AchievementsPageView = ({
  achievements,
  onCreateAchievement,
  onUpdate,
  onDelete,
  onDragEnd,
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
      <SortableGrid.Container items={achievements} onDragEnd={onDragEnd}>
        {(items) => (
          <div className='grid grid-cols-3 gap-4'>
            {items.map((item) => (
              <SortableGrid.Item key={item.id} id={item.id} iconSize={32}>
                <AchievementsCard
                  achievement={item.data}
                  onUpdate={(data) => onUpdate(item.data, data)}
                  onDelete={() => onDelete(item.data)}
                />
              </SortableGrid.Item>
            ))}
          </div>
        )}
      </SortableGrid.Container>
    </div>
  )
}
