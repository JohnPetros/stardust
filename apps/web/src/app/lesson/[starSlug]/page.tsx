import type { NextParams } from '@/server/next/types'
import { LessonPage } from '@/ui/lesson/widgets/pages/Lesson'
import { lessonActions, spaceActions } from '@/server/next-safe-action'

export default async function Lesson({ params }: NextParams<{ starSlug: string }>) {
  const spaceResponse = await spaceActions.accessStarPage({ starSlug: params.starSlug })
  const starDto = spaceResponse?.data
  if (!starDto?.id) return

  const lessonResponse = await lessonActions.fetchLessonStoryAndQuestions({
    starId: starDto.id,
  })
  if (!lessonResponse?.data) return

  return (
    <LessonPage
      starId={starDto.id}
      starName={starDto.name}
      starNumber={starDto.number}
      questionsDto={lessonResponse.data.questions}
      storyContent={lessonResponse.data.story}
      textsBlocksDto={lessonResponse.data.textsBlocks}
    />
  )
}
