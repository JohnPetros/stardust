import { _getRewardsPageData } from './_getRewardsPageData'
import { _getUpdatedLevel } from './_getUpdatedLevel'

import { User } from '@/@types/User'
import { DateProvider } from '@/providers/dateProvider'
import { IAuthController } from '@/services/api/interfaces/IAuthController'
import { IChallengesController } from '@/services/api/interfaces/IChallengesController'
import { IStarsController } from '@/services/api/interfaces/IStarsController'
import { IUsersController } from '@/services/api/interfaces/IUsersController'
import { APP_ERRORS } from '@/global/constants'

const dateProvider = DateProvider()

type _HandleRewardsPageParams = {
  rewardsPayload: string | null
  authController: IAuthController
  usersController: IUsersController
  challengesController: IChallengesController
  starsController: IStarsController
}

export async function _handleRewardsPage({
  rewardsPayload,
  authController,
  usersController,
  starsController,
  challengesController,
}: _HandleRewardsPageParams) {
  const userId = await authController.getUserId()

  if (!userId) throw new Error(APP_ERRORS.auth.userNotFound)
  if (!rewardsPayload) throw new Error(APP_ERRORS.rewards.payloadNotFound)

  const user = await usersController.getUserById(userId)

  const { xp, coins, accurance, seconds, nextRoute } =
    await _getRewardsPageData({
      user,
      rewardsPayload,
      usersController,
      starsController,
      challengesController,
    })

  const updatedLevel = await _getUpdatedLevel(xp, user.level)

  const todayIndex = dateProvider.getTodayIndex()
  const todayStatus = user.weekStatus[todayIndex]

  return {
    xp,
    coins,
    accurance,
    seconds,
    nextRoute,
    updatedLevel,
    todayStatus,
  }
}
