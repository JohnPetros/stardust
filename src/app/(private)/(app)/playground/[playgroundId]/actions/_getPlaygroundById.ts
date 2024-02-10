'use server'

import { notFound } from 'next/navigation'

import type { Playground } from '@/@types/Playground'
import { IPlaygroundsController } from '@/services/api/interfaces/IPlaygroundsController'

let playground: Playground

export async function _getPlaygroundById(
  playgroundId: string,
  playgroudsController: IPlaygroundsController
) {
  try {
    playground = await playgroudsController.getPlaygroundById(playgroundId)

    return playground
  } catch (error) {
    console.error(error)
    notFound()
  }
}
