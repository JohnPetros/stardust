import { useLoaderData } from 'react-router'

import { Id } from '@stardust/core/global/structures'

import type { clientLoader } from '@/app/routes/LessonStoryRoute'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { LessonStoryPageView } from './LessonStoryPageView'
import { useLessonStoryPage } from './useLessonStoryPage'
import { useToastProvider } from '@/ui/global/hooks/useToastProvider'

export const LessonStoryPage = () => {
  const { starId } = useLoaderData<typeof clientLoader>()
  const { lessonService } = useRestContext()
  const toastProvider = useToastProvider()
  const page = useLessonStoryPage({
    lessonService,
    toastProvider,
    starId: Id.create(starId),
  })

  return <LessonStoryPageView {...page} />
}
