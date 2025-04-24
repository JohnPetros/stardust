import type { Achievement } from '@stardust/core/profile/entities'
import { AchievementCard } from '../../../components/AchievementCard'
import { EmptyListMessage } from './EmptyListMessage'

type UnlockedAchievementsListProps = {
  unlockedAchievements: Achievement[]
}

export function UnlockedAchievementsList({
  unlockedAchievements,
}: UnlockedAchievementsListProps) {
  if (unlockedAchievements.length) {
    return (
      <div className='custom-scroll grid h-72 grid-cols-1 content-start gap-4 overflow-y-auto px-1 md:grid-cols-2'>
        {unlockedAchievements.map((achievement) => (
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
