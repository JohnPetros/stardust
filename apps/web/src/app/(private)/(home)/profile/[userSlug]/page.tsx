import { notFound } from 'next/navigation'

import { SupabaseServerClient } from '@/api/supabase/clients'
import { SupabaseProfileService } from '@/api/supabase/services'

import { ProfilePage } from '@/ui/profile/widgets/pages/Profile'

export const dynamic = 'force-dynamic'

type ProfilePageProps = {
  params: { userSlug: string }
}

export default async function Profile({ params }: ProfilePageProps) {
  const supabase = SupabaseServerClient()
  const usersService = SupabaseProfileService(supabase)
  const userResponse = await usersService.fetchUserBySlug(params.userSlug)

  if (userResponse.isFailure) {
    return notFound()
  }
  const userDto = userResponse.body

  const achievementsService = SupabaseProfileService(supabase)
  const unlockedAchievementsResponse =
    await achievementsService.fetchUnlockedAchievements(String(userDto.id))

  if (unlockedAchievementsResponse.isFailure) {
    unlockedAchievementsResponse.throwError()
  }
  const unlockedAchievementsDto = unlockedAchievementsResponse.body

  return (
    <ProfilePage userDto={userDto} unlockedAchievementsDto={unlockedAchievementsDto} />
  )
}
