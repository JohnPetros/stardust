'use server'

import { IAuthController } from '@/services/api/interfaces/IAuthController'
import { IPlaygroundsController } from '@/services/api/interfaces/IPlaygroundsController'
import { APP_ERRORS } from '@/utils/constants'

export async function _handleUserPlaygroudsPage(
  authController: IAuthController,
  playgroundsController: IPlaygroundsController
) {
  const userId = await authController.getUserId()

  if (!userId) throw new Error(APP_ERRORS.auth.userNotFound)

  const playgrounds = await playgroundsController.getPlaygroundsByUserId(userId)

  return playgrounds
}
