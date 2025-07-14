import type { NextParams } from '@/rpc/next/types'
import { LessonPage } from '@/ui/lesson/widgets/pages/Lesson'
import { lessonActions, spaceActions } from '@/rpc/next-safe-action'

const Page = async ({ params }: NextParams<'starSlug'>) => {
  const { starSlug } = await params
  const spaceResponse = await spaceActions.accessStarPage({
    starSlug,
  })
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

export default Page
