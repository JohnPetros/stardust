'use server'

import { notFound } from 'next/navigation'

import type { Playground } from '@/@types/Playground'
import { IAuthController } from '@/services/api/interfaces/IAuthController'

export async function _checkPublicPlayground(
  playground: Playground,
  authController: IAuthController
) {
  try {
    const userId = await authController.getUserId()

    return playground.isPublic || playground.user.id === userId
  } catch (error) {
    console.error(error)
    notFound()
  }
}
