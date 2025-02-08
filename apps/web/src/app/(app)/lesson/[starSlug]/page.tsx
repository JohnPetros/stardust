import type { NextParams } from '@/server/next/types'
import { LessonPage } from '@/ui/lesson/widgets/pages/Lesson'
import { lessonActions, spaceActions } from '@/server/next-safe-action'
import { questions } from '@/__tests__/mocks/lesson/planets/planet2/star1/questions'

const story = `<Code key={'1dc2b735-704a-43e7-aafc-dff164a2ed06'}  hasAnimation={false} isRunnable={true}>var seuNome = leia("Insira seu nome: ")
escreva(seuNome)</Code>`

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
      questionsDto={questions}
      storyContent={lessonResponse.data.story}
      textsBlocksDto={lessonResponse.data.textsBlocks}
    />
  )
}
