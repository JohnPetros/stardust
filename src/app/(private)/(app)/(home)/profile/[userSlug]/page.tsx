import { notFound } from 'next/navigation'
import { createClient as createServerClient } from 'supabase/supabase-server'

import { Achievements } from '../components/Achievements'
import { ChallengesChart } from '../components/ChallengesChart'
import { Crafts } from '../components/Crafts'
import { Statistics } from '../components/Statistics'
import { StreakBoard } from '../components/StreakBoard'
import { User } from '../components/User'

import { User as UserData } from '@/@types/user'
import { UserService } from '@/services/api/userService'

interface ProfileProps {
  params: { userSlug: string }
}

export default async function Profile({ params }: ProfileProps) {
  const supabase = createServerClient()
  const userService = UserService(supabase)
  let user: UserData

  try {
    user = await userService.getUserBySlug(params.userSlug)
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
              <Statistics data={user} />
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
