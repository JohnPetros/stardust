import { useState } from 'react'

import type { ManualService } from '@stardust/core/manual/interfaces'
import { Guide } from '@stardust/core/manual/entities'
import { GuideCategory } from '@stardust/core/manual/structures'

import { CACHE } from '@/constants'
import { useCache } from '@/ui/global/hooks/useCache'

export function useGuidesDialog(manualService: ManualService) {
  const [content, setContent] = useState('')
  const [shouldFetchGuides, setShouldFetchGuides] = useState(false)

  async function fetchGuides() {
    const response = await manualService.fetchGuidesByCategory(
      GuideCategory.createAsLsp(),
    )
    if (response.isFailure) response.throwError()
    return response.body
  }

  const { data: guides, isLoading } = useCache({
    key: CACHE.keys.guides,
    fetcher: fetchGuides,
  })

  function handleDialogOpen(isOpen: boolean) {
    if (isOpen && !shouldFetchGuides) {
      setShouldFetchGuides(true)
    }
  }

  function handleGuideButtonClick(guideId: string) {
    if (!guides) return
    const guideContent = guides.find((guide) => guide.id === guideId)?.content
    if (guideContent) setContent(guideContent)
  }

  function handleBackButtonClick() {
    setContent('')
  }

  return {
    guides: guides ? guides.map(Guide.create) : [],
    isLoading,
    content,
    handleGuideButtonClick,
    handleBackButtonClick,
    handleDialogOpen,
  }
}
