import { _handleRewardsPage } from './actions/_handleRewardsPage'
import { Congratulations } from './components/Congratulations'

import { getCookie } from '@/global/actions/_getCookie'
import { SupabaseServerClient } from '@/services/api/supabase/clients/SupabaseServerClient'
import { SupabaseAuthController } from '@/services/api/supabase/controllers/SupabaseAuthController'
import { SupabaseChallengesController } from '@/services/api/supabase/controllers/SupabaseChallengesController'
import { SupabaseStarsController } from '@/services/api/supabase/controllers/SupabaseStarsController'
import { SupabaseUsersController } from '@/services/api/supabase/controllers/SupabaseUsersController'
import { COOKIES } from '@/global/constants'
import { formatSecondsToTime } from '@/global/helpers'

export default async function RewardsPage() {
  const rewardsPayload = await getCookie(COOKIES.keys.rewardsPayload)

  const supabase = SupabaseServerClient()
  const authController = SupabaseAuthController(supabase)
  const starsController = SupabaseStarsController(supabase)
  const challengesController = SupabaseChallengesController(supabase)
  const usersController = SupabaseUsersController(supabase)

  const {
    xp,
    coins,
    accurance,
    seconds,
    nextRoute,
    todayStatus,
    updatedLevel,
  } = await _handleRewardsPage({
    rewardsPayload,
    authController,
    challengesController,
    starsController,
    usersController,
  })

  return (
    <Congratulations
      xp={xp}
      coins={coins}
      accurance={accurance}
      time={formatSecondsToTime(seconds)}
      nextRoute={nextRoute}
      todayStatus={todayStatus}
      updatedLevel={updatedLevel}
    />
  )
}
