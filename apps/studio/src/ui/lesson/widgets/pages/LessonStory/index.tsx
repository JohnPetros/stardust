import { useScreen } from 'usehooks-ts'
import { useLoaderData } from 'react-router'

import { Id } from '@stardust/core/global/structures'

import type { clientLoader } from '@/app/routes/LessonStoryRoute'
import { useRest } from '@/ui/global/hooks/useRest'
import { LessonStoryPageView } from './LessonStoryPageView'
import { useLessonStoryPage } from './useLessonStoryPage'
import { useToastProvider } from '@/ui/global/hooks/useToastProvider'

export const LessonStoryPage = () => {
  const { starId, defaultStory } = useLoaderData<typeof clientLoader>()
  const { lessonService } = useRest()
  const toastProvider = useToastProvider()
  const { story, handleSaveButtonClick, handleStoryChange } = useLessonStoryPage({
    lessonService,
    toastProvider,
    starId: Id.create(starId),
    defaultStory,
  })
  const screen = useScreen()

  return (
    <LessonStoryPageView
      story={story}
      editorHeight={screen.height * 0.68}
      isStorySaveDisabled={Boolean(!story)}
      onStoryChange={handleStoryChange}
      onStorySave={handleSaveButtonClick}
    />
  )
}
