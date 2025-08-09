import { useState } from 'react'

import { Id } from '@stardust/core/global/structures'
import type { LessonService } from '@stardust/core/lesson/interfaces'

export function useLessonQuestionsPage(lessonService: LessonService, starId: Id) {
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isSaveFailure, setIsSaveFailure] = useState(false)
  const [canSave, setCanSave] = useState(false)

  function handleQuestionButtonClick(questionType: string) {
    console.log(questionType)
  }

  async function handleSaveButtonClick() {
    // TODO: Implement save questions
  }

  return { isSaving, isSaved, isSaveFailure, canSave, handleSaveButtonClick }
}
