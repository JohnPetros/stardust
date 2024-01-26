import { getRewards } from './actions/getRewards'
import { getUpdatedLevel } from './actions/getUpdatedLevel'
import { Congratulations } from './components/Congratulations'

import { getCookie } from '@/app/server/actions/getCookie'
import { DateProvider } from '@/providers/dateProvider'
import { createServerClient } from '@/services/api/supabase/clients/serverClient'
import { AuthController } from '@/services/api/supabase/controllers/authController'
import { UsersController } from '@/services/api/supabase/controllers/usersController'
import { COOKIES, ERRORS } from '@/utils/constants'
import { formatSecondsToTime } from '@/utils/helpers'

const dateProvider = DateProvider()

export default async function RewardsPage() {
  const payload = await getCookie(COOKIES.rewardsPayload)

  console.log({ payload })

  const supabase = createServerClient()
  const authController = AuthController(supabase)
  const userId = await authController.getUserId()

  if (!userId) throw new Error(ERRORS.auth.userNotFound)
  if (!payload) throw new Error(ERRORS.rewards.payloadNotFound)

  const user = await UsersController(supabase).getUserById(userId)

  const { xp, coins, accurance, seconds, nextRoute } = await getRewards(
    payload,
    user
  )

  const updatedLevel = await getUpdatedLevel(xp, user.level)

  const todayIndex = dateProvider.getTodayIndex()
  const todayStatus = user.week_status[todayIndex]

  console.log({ seconds })
  console.log(formatSecondsToTime(seconds))

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
