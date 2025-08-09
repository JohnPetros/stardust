import { useLoaderData } from 'react-router'
import type { Route } from './+types/LessonStoryRoute'

import { Slug } from '@stardust/core/global/structures'
import { Star } from '@stardust/core/space/entities'

import { QuizContextProvider } from '@/ui/lesson/contexts/QuizContext'
import { LessonQuestionsPage } from '@/ui/lesson/widgets/pages/LessonQuestions'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'
import { RestMiddleware } from '../middlewares/RestMiddleware'
import { restContext } from '../contexts/RestContext'

export const unstable_clientMiddleware = [AuthMiddleware, RestMiddleware]

export const clientLoader = async ({ context, params }: Route.LoaderArgs) => {
  const { spaceService, lessonService } = context.get(restContext)
  const response = await spaceService.fetchStarBySlug(Slug.create(params.starSlug))
  if (response.isFailure) response.throwError()

  const star = Star.create(response.body)
  const lessonResponse = await lessonService.fetchQuestions(star.id)
  if (lessonResponse.isFailure) lessonResponse.throwError()

  return {
    starId: star.id.value,
    starName: star.name.value,
    starNumber: star.number.value,
    questions: lessonResponse.body,
  }
}

const LessonQuestionsRoute = () => {
  const { questions } = useLoaderData<typeof clientLoader>()
  return (
    <QuizContextProvider questions={questions}>
      <LessonQuestionsPage />
    </QuizContextProvider>
  )
}

export default LessonQuestionsRoute
