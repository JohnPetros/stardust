'use server'

import { _getLasUnlockedStarId } from './_getLasUnlockedStarId'
import { _getPlanets } from './_getPlanets'

import { IAuthController } from '@/services/api/interfaces/IAuthController'
import { IPlanetsController } from '@/services/api/interfaces/IPlanetsController'
import { IStarsController } from '@/services/api/interfaces/IStarsController'
import { APP_ERRORS } from '@/global/constants'

type _HandleSpacePageParams = {
  authController: IAuthController
  starsController: IStarsController
  planetsController: IPlanetsController
}

export async function _handleSpacePage({
  authController,
  planetsController,
  starsController,
}: _HandleSpacePageParams) {
  const userId = await authController.getUserId()

  if (!userId) throw new Error(APP_ERRORS.auth.userNotFound)

  const userUnlockedStarsIds =
    await starsController.getUserUnlockedStarsIds(userId)

  try {
    const planets = await _getPlanets(userUnlockedStarsIds, planetsController)
    const lastUnlockedStarId = await _getLasUnlockedStarId(
      planets,
      userUnlockedStarsIds
    )

    return { planets, lastUnlockedStarId }
  } catch (error) {
    throw new Error(APP_ERRORS.planets.failedFetching)
  }
}
