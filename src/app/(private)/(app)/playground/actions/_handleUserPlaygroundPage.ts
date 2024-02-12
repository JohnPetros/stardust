'use server'

import { APP_ERRORS } from '@/global/constants'
import { IAuthController } from '@/services/api/interfaces/IAuthController'
import { IPlaygroundsController } from '@/services/api/interfaces/IPlaygroundsController'
import { IUsersController } from '@/services/api/interfaces/IUsersController'

export async function _handleUserPlaygroudsPage(
  authController: IAuthController,
  usersController: IUsersController,
  playgroundsController: IPlaygroundsController
) {
  const userId = await authController.getUserId()

  if (!userId) throw new Error(APP_ERRORS.auth.userNotFound)

  const user = await usersController.getUserById(userId)
  const playgrounds = await playgroundsController.getPlaygroundsByUserSlug(
    user.slug
  )

  return playgrounds
}
