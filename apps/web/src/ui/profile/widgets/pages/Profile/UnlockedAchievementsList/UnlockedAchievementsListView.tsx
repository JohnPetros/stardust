import { Achievement } from '@stardust/core/profile/entities'
import type { AchievementDto } from '@stardust/core/profile/entities/dtos'

import { AchievementCard } from '../../../components/AchievementCard'
import { EmptyListMessage } from './EmptyListMessage'

type UnlockedAchievementsListProps = {
  unlockedAchievements: AchievementDto[]
}

export const UnlockedAchievementsListView = ({
  unlockedAchievements,
}: UnlockedAchievementsListProps) => {
  if (unlockedAchievements.length) {
    const achievements = unlockedAchievements.map(Achievement.create)
    return (
      <div className='custom-scroll grid h-72 grid-cols-1 content-start gap-4 overflow-y-auto px-1 md:grid-cols-2'>
        {achievements.map((achievement) => (
          <div key={achievement.id.value} className='h-24'>
            <AchievementCard
              id={achievement.id.value}
              name={achievement.name.value}
              icon={achievement.icon.value}
              reward={achievement.reward.value}
              description={achievement.description}
              isUnlocked={true}
              isRescuable={false}
            />
          </div>
        ))}
      </div>
    )
  }
  return <EmptyListMessage />
}
