import { User } from '@stardust/core/global/entities'
import { Achievement } from '@stardust/core/profile/entities'
import type { UserDto } from '@stardust/core/global/dtos'
import type { AchievementDto } from '@stardust/core/profile/dtos'

import { StreakBoard } from '@/ui/global/widgets/components/StreakBoard'
import { Account } from './Account'
import { Statistics } from './Statistics'
import { ChallengesChart } from './ChallengesChart'
import { UnlockedAchievementsList } from './UnlockedAchievementsList'
import { CraftsTable } from './CraftsTable'

type ProfilePageProps = {
  userDto: UserDto
  unlockedAchievementsDto: AchievementDto[]
}

export function ProfilePage({ userDto, unlockedAchievementsDto }: ProfilePageProps) {
  const user = User.create(userDto)
  const unlockedAchievements = unlockedAchievementsDto.map(Achievement.create)

  return (
    <div className='mx-auto max-w-sm px-6 pb-32 pt-8 md:max-w-5xl md:pb-12'>
      <div>
        <Account
          id={user.id.value}
          name={user.name.value}
          level={user.level.value}
          xp={user.xp.value}
          avatar={{ name: user.avatar.name.value, image: user.avatar.image.value }}
          rocket={{ name: user.rocket.name.value, image: user.rocket.image.value }}
          tier={{ name: user.tier.name.value, image: user.tier.image.value }}
          createdAt={user.createdAt}
        />
        <div className='mt-10 grid grid-cols-1 items-center justify-center gap-12 md:grid-cols-[1fr_2fr] md:flex-row'>
          <Statistics
            unlockedStarsCount={user.unlockedStarsCount.value}
            completedPlanetsCount={user.completedPlanetsCount.value}
            unlockedAchievementsCount={user.unlockedAchievementsCount.value}
          />
          <StreakBoard weekStatus={user.weekStatus} streakCount={user.streak.value} />
        </div>
        <div className='mt-10 grid grid-cols-1 gap-6 md:grid-cols-[1fr_2fr]'>
          <div>
            <h4 className='text-gray-100'>Desafios concluídos</h4>
            <ChallengesChart />
          </div>
          <div>
            <h4 className='mb-3 text-center text-gray-100'>Conquistas adquiridas</h4>
            <div>
              <UnlockedAchievementsList unlockedAchievements={unlockedAchievements} />
            </div>
          </div>
        </div>

        <div className='mt-12'>
          <CraftsTable userId={user.id.value} />
        </div>
      </div>
    </div>
  )
}
