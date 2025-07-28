import type { Route } from './+types/LessonStoryRoute'

import { LessonStoryPage } from '@/ui/lesson/widgets/pages/LessonStory'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'
import { RestMiddleware } from '../middlewares/RestMiddleware'
import { restContext } from '../contexts/restContext'
import { Slug } from '@stardust/core/global/structures'

export const unstable_clientMiddleware = [AuthMiddleware, RestMiddleware]

export const clientLoader = async ({ context, params }: Route.LoaderArgs) => {
  const { spaceService } = context.get(restContext)
  const response = await spaceService.fetchStarBySlug(Slug.create(params.starSlug))

  return {
    starName: response.body.name,
    starNumber: response.body.number,
  }
}

const LessonStoryRoute = () => {
  return <LessonStoryPage />
}

export default LessonStoryRoute
