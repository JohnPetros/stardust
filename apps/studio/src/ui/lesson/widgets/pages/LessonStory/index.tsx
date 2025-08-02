import { useScreen } from 'usehooks-ts'
import { useLoaderData } from 'react-router'

import { Id } from '@stardust/core/global/structures'

import type { clientLoader } from '@/app/routes/LessonStoryRoute'
import { useRest } from '@/ui/global/hooks/useRest'
import { LessonStoryPageView } from './LessonStoryPageView'
import { useLessonStoryPage } from './useLessonStoryPage'

export const LessonStoryPage = () => {
  const { starId, defaultStory } = useLoaderData<typeof clientLoader>()
  const { lessonService } = useRest()
  const {
    isStorySaving,
    story,
    isStorySaved,
    isStorySaveFailure,
    canSaveStory,
    handleSaveButtonClick,
    handleStoryChange,
  } = useLessonStoryPage(lessonService, Id.create(starId), defaultStory)
  const screen = useScreen()

  return (
    <LessonStoryPageView
      story={story}
      editorHeight={screen.height * 0.68}
      isStorySaving={isStorySaving}
      isStorySaved={isStorySaved}
      isStorySaveFailure={isStorySaveFailure}
      canSaveStory={canSaveStory}
      isStorySaveDisabled={Boolean(!story)}
      onStoryChange={handleStoryChange}
      onStorySave={handleSaveButtonClick}
    />
  )
}
