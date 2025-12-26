import { useLoaderData } from 'react-router'
import { useScreen } from 'usehooks-ts'

import { Guide } from '@stardust/core/manual/entities'

import type { clientLoader } from '@/app/routes/GuidePageRoute'
import { useRest } from '@/ui/global/hooks/useRest'
import { useToastProvider } from '@/ui/global/hooks/useToastProvider'
import { GuidePageView } from './GuidePageView'
import { useGuidePage } from './useGuidePage'

export const GuidePage = () => {
  const { guideDto } = useLoaderData<typeof clientLoader>()
  const { manualService } = useRest()
  const toastProvider = useToastProvider()
  const { content, handleSaveButtonClick, handleContentChange } = useGuidePage({
    manualService,
    toastProvider,
    guide: Guide.create(guideDto),
  })
  const screen = useScreen()

  return (
    <GuidePageView
      title={guideDto.title}
      content={content.value}
      editorHeight={screen.height * 0.68}
      isSaveDisabled={Boolean(!content)}
      onContentChange={handleContentChange}
      onSave={handleSaveButtonClick}
    />
  )
}
