import { useLoaderData } from 'react-router'

import { Id } from '@stardust/core/global/structures'

import type { clientLoader } from '@/app/routes/LessonQuestionsRoute'
import { useRest } from '@/ui/global/hooks/useRest'
import { useQuizContext } from '@/ui/global/hooks/useQuizContext'
import { QuizActionButtonView } from './QuizActionButtonView'
import { useQuizActionButton } from './useQuizActionButton'

export const QuizActionButton = () => {
  const { starId } = useLoaderData<typeof clientLoader>()
  const { questions } = useQuizContext()
  const { lessonService } = useRest()
  const { isDisabled, handleClick } = useQuizActionButton(
    lessonService,
    Id.create(starId),
    questions.map((question) => question.data),
  )

  return <QuizActionButtonView isDisabled={isDisabled} onClick={handleClick} />
}
