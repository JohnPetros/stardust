import { redirect } from 'next/navigation'

import type { NextParams } from '@/server/next/types'
import {
  SupabaseAuthService,
  SupabaseLessonService,
  SupabaseSpaceService,
} from '@/api/supabase/services'
import { SupabaseServerClient } from '@/api/supabase/clients/SupabaseServerClient'
import { LessonPage } from '@/ui/lesson/widgets/pages/Lesson'
import { ROUTES } from '@/constants'

export default async function Lesson({ params }: NextParams<{ starSlug: string }>) {
  const supabase = SupabaseServerClient()
  const authService = SupabaseAuthService(supabase)
  const spaceService = SupabaseSpaceService(supabase)
  const lessonService = SupabaseLessonService(supabase)

  const userIdResponse = await authService.fetchUserId()
  if (userIdResponse.isFailure) userIdResponse.throwError()
  const userId = userIdResponse.body

  const starResponse = await spaceService.fetchStarBySlug(params.starSlug)
  if (starResponse.isFailure) starResponse.throwError()
  const star = starResponse.body

  const starIsUnlockedResponse = await spaceService.verifyStarIsUnlocked(star.id, userId)

  if (starIsUnlockedResponse.isFailure || !starIsUnlockedResponse.body) {
    return redirect(ROUTES.space)
  }

  const questionsResponse = await lessonService.fetchQuestionsByStar(star.id)
  if (questionsResponse.isFailure) questionsResponse.throwError()
  const questions = questionsResponse.body

  const textsBlocksResponse = await lessonService.fetchTextsBlocksByStar(star.id)
  if (textsBlocksResponse.isFailure) textsBlocksResponse.throwError()
  const textsBlocks = textsBlocksResponse.body

  const storyResponse = await lessonService.fetchStarStory(star.id)
  if (textsBlocksResponse.isFailure) textsBlocksResponse.throwError()
  const story = storyResponse.body.story

  return (
    <LessonPage
      starId={star.id}
      starName={star.name}
      starNumber={star.number}
      storyContent={story}
      questionsDto={questions}
      textsBlocksDto={textsBlocks}
    />
  )
}
