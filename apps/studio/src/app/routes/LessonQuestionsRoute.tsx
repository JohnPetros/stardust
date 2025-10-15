import type { Route } from './+types/LessonQuestionsRoute'

import { Slug } from '@stardust/core/global/structures'
import { Star } from '@stardust/core/space/entities'

import { QuizContextProvider } from '@/ui/lesson/contexts/QuizContext'
import { LessonQuizPage } from '@/ui/lesson/widgets/pages/LessonQuizPage'
import { AuthMiddleware } from '../middlewares/AuthMiddleware'
import { RestMiddleware } from '../middlewares/RestMiddleware'
import { restContext } from '../contexts/RestContext'
import { useLoaderData } from 'react-router'

export const clientMiddleware = [AuthMiddleware, RestMiddleware]

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
      <LessonQuizPage />
    </QuizContextProvider>
  )
}

export default LessonQuestionsRoute
