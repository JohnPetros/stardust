import { notFound } from 'next/navigation'

import { SupabaseServerClient } from '@/infra/api/supabase/clients'
import {
  SupabaseAchievementsService,
  SupabaseUsersService,
} from '@/infra/api/supabase/services'
import { ProfilePage } from '@/ui/profile/widgets/pages/Profile'

export const dynamic = 'force-dynamic'

type ProfilePageProps = {
  params: { userSlug: string }
}

export default async function Profile({ params }: ProfilePageProps) {
  const supabase = SupabaseServerClient()
  const usersService = SupabaseUsersService(supabase)
  const userResponse = await usersService.fetchUserBySlug(params.userSlug)

  if (userResponse.isFailure) {
    return notFound()
  }
  const userDto = userResponse.data

  const achievementsService = SupabaseAchievementsService(supabase)
  const unlockedAchievementsResponse =
    await achievementsService.fetchUnlockedAchievements(String(userDto.id))

  if (unlockedAchievementsResponse.isFailure) {
    unlockedAchievementsResponse.throwError()
  }
  const unlockedAchievementsDto = unlockedAchievementsResponse.data

  return (
    <ProfilePage userDto={userDto} unlockedAchievementsDto={unlockedAchievementsDto} />
  )
}
