import type { Route } from './+types/LessonStoryRoute'

import { Slug } from '@stardust/core/global/structures'
import { Star } from '@stardust/core/space/entities'

import { LessonStoryPage } from '@/ui/lesson/widgets/pages/LessonStory'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'
import { RestMiddleware } from '../middlewares/RestMiddleware'
import { restContext } from '../contexts/RestContext'

export const unstable_clientMiddleware = [AuthMiddleware, RestMiddleware]

export const clientLoader = async ({ context, params }: Route.LoaderArgs) => {
  const { spaceService, lessonService } = context.get(restContext)
  const response = await spaceService.fetchStarBySlug(Slug.create(params.starSlug))
  if (response.isFailure) response.throwError()

  const star = Star.create(response.body)
  const lessonResponse = await lessonService.fetchStarStory(star.id)
  if (lessonResponse.isFailure) lessonResponse.throwError()

  return {
    starId: star.id.value,
    starName: star.name.value,
    starNumber: star.number.value,
    defaultStory: lessonResponse.body.story.replaceAll('---', '----'),
  }
}

const LessonStoryRoute = () => {
  return <LessonStoryPage />
}

export default LessonStoryRoute
