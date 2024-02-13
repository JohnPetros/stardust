'use server'

import { notFound, redirect } from 'next/navigation'

import type { Star } from '@/@types/Star'
import { ROUTES } from '@/global/constants'
import { IStarsController } from '@/services/api/interfaces/IStarsController'

let lessonStar: Star

export async function _handleLessonPage(
  userId: string,
  starSlug: string,
  starsController: IStarsController
) {
  try {
    lessonStar = await starsController.getStarBySlug(starSlug)
  } catch (error) {
    console.error(error)
    return notFound()
  }

  const isUnlocked = await starsController.checkStarUnlocking(
    lessonStar.id,
    userId
  )

  if (!isUnlocked) {
    return redirect(ROUTES.private.home.space)
  }

  return lessonStar
}
