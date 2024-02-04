import { notFound } from 'next/navigation'

import { Achievements } from '../components/Achievements'
import { ChallengesChart } from '../components/ChallengesChart'
import { Crafts } from '../components/Crafts'
import { Statistics } from '../components/Statistics'
import { User } from '../components/User'

import { User as UserData } from '@/@types/user'
import { StreakBoard } from '@/app/components/StreakBoard'
import { createServerClient } from '@/services/api/supabase/clients/serverClient'
import { UsersController } from '@/services/api/supabase/controllers/usersController'

type ProfileProps = {
  params: { userSlug: string }
}

export default async function Profile({ params }: ProfileProps) {
  const supabase = createServerClient()
  const usersController = UsersController(supabase)
  let user: UserData

  try {
    user = await usersController.getUserBySlug(params.userSlug)
  } catch (error) {
    console.error(error)
    notFound()
  }

  if (user)
    return (
      <div className="mx-auto max-w-sm px-6 pb-32 pt-8 md:max-w-5xl md:pb-12">
        {user?.id && (
          <div>
            <User data={user} />
            <div className="mt-10 grid grid-cols-1 items-center justify-center gap-12 md:grid-cols-[1fr_2fr] md:flex-row">
              <Statistics
                unlockedStarsCount={user.unlocked_stars_count}
                completedPlanetsCount={user.completed_planets_count}
                unlockedAchievementsCount={user.unlocked_achievements_count}
              />
              <StreakBoard
                weekStatus={user.week_status}
                streakAmount={user.streak}
              />
            </div>
            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-[1fr_1.5fr]">
              <div>
                <h4 className="text-gray-100">Desafios concluídos</h4>
                <ChallengesChart userId={user.id} />
              </div>
              <div>
                <h4 className="mb-3 text-center text-gray-100">
                  Conquistas adquiridas
                </h4>
                <div>
                  <Achievements userId={user.id} />
                </div>
              </div>
            </div>

            <div className="mt-12">
              <Crafts />
            </div>
          </div>
        )}
      </div>
    )
}
