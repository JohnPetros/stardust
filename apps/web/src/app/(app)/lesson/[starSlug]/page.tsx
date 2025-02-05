import type { NextParams } from '@/server/next/types'
import { LessonPage } from '@/ui/lesson/widgets/pages/Lesson'
import { lessonActions, spaceActions } from '@/server/next-safe-action'
import { questions } from '@/__tests__/mocks/lesson/planets/planet1/star1/questions'

const story = `<Code>
programa preparar o foguete

Inicio

  Localizar um foguete disponivel
  Verificar os niveis de combustivel
  Verificar o suprimento a bordo
  Verificar os niveis de oxigenio

  Se necessario, obter recursos adicionais
  Caso contrario, preparar a decolagem do foguete

  Aguardar ate que o foguete entre em orbita
  Aproveitar a jornada enquanto o foguete viaja pelo espaço

Fim
</Code>`

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
