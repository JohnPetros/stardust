'use server'

import { notFound } from 'next/navigation'

import type { Star } from '@/@types/Star'
import { IStarsController } from '@/services/api/interfaces/IStarsController'

let lessonStar: Star

export async function _handleLessonPage(
  starSlug: string,
  starsController: IStarsController
) {
  try {
    lessonStar = await starsController.getStarBySlug(starSlug)
  } catch (error) {
    console.error(error)
    notFound()
  }

  // const lessonStar = {
  //   ...star,
  //   texts: [],
  // }

  return lessonStar
}
