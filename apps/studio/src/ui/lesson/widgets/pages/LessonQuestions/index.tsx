import { useLoaderData } from 'react-router'

import { Id } from '@stardust/core/global/structures'

import type { clientLoader } from '@/app/routes/LessonQuestionsRoute'
import { useRest } from '@/ui/global/hooks/useRest'
import { LessonQuestionsPageView } from './LessonQuestionsPageView'
import { useLessonQuestionsPage } from './useLessonQuestionsPage'

export const LessonQuestionsPage = () => {
  const { starId } = useLoaderData<typeof clientLoader>()
  const { lessonService } = useRest()
  const { isSaving, isSaved, isSaveFailure, canSave, handleSaveButtonClick } =
    useLessonQuestionsPage(lessonService, Id.create(starId))

  return (
    <LessonQuestionsPageView
      isSaving={isSaving}
      isSaved={isSaved}
      canSave={canSave}
      isSaveFailure={isSaveFailure}
      isSaveDisabled={false}
      onSave={handleSaveButtonClick}
    />
  )
}
