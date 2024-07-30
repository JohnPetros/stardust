import { redirect } from 'next/navigation'

import { SupabaseServerClient } from '@/infra/api/supabase/clients'
import {
  SupabaseAuthService,
  SupabaseLessonService,
  SupabaseStarsService,
} from '@/infra/api/supabase/services'
import { LessonPage } from '@/modules/app/components/pages/Lesson'
import { ROUTES } from '@/modules/global/constants'

type LessonPageProps = {
  params: { starSlug: string }
}

export default async function Lesson({ params }: LessonPageProps) {
  const supabase = SupabaseServerClient()
  const starsService = SupabaseStarsService(supabase)
  const authService = SupabaseAuthService(supabase)
  const lessonService = SupabaseLessonService(supabase)

  const userIdResponse = await authService.fetchUserId()
  if (userIdResponse.isFailure) userIdResponse.throwError()
  const userId = userIdResponse.data

  const starResponse = await starsService.fetchStarBySlug(params.starSlug)
  if (starResponse.isFailure) starResponse.throwError()
  const star = starResponse.data

  const starIsUnlockedResponse = await starsService.verifyStarIsUnlocked(star.id, userId)

  if (starIsUnlockedResponse.isFailure || !starIsUnlockedResponse.data) {
    return redirect(ROUTES.private.app.home.space)
  }

  const questionsResponse = await lessonService.fetchQuestionsByStar(star.id)
  if (questionsResponse.isFailure) questionsResponse.throwError()
  const questions = questionsResponse.data

  const textsBlocksResponse = await lessonService.fetchTextsBlocksByStar(star.id)
  if (textsBlocksResponse.isFailure) textsBlocksResponse.throwError()
  const textsBlocks = textsBlocksResponse.data

  return (
    <LessonPage
      starId={star.id}
      starName={star.name}
      starNumber={star.number}
      questionsDTO={questions}
      textsBlocksDTO={textsBlocks}
    />
  )
}
