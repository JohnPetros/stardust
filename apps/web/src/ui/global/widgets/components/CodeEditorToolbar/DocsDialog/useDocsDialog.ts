import { useState } from 'react'

import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import { Doc } from '@stardust/core/challenging/entities'

import { CACHE } from '@/constants'
import { useCache } from '@/ui/global/hooks/useCache'

export function useDocsDialog(challengingService: ChallengingService) {
  const [content, setContent] = useState('')
  const [shouldFetchDocs, setShouldFetchDocs] = useState(false)

  function handleDialogOpen(isOpen: boolean) {
    if (isOpen && !shouldFetchDocs) {
      setShouldFetchDocs(true)
    }
  }

  function handleBackButton() {
    setContent('')
  }

  async function fetchDocs() {
    const response = await challengingService.fetchDocs()
    if (response.isFailure) response.throwError()
    return response.body
  }

  const { data: docs, isLoading } = useCache({
    key: CACHE.keys.docs,
    fetcher: fetchDocs,
  })

  function handleDocButton(docId: string) {
    if (!docs) return
    const docContent = docs.find((doc) => doc.id === docId)?.content
    if (docContent) setContent(docContent)
  }

  return {
    docs: docs?.map(Doc.create),
    isLoading,
    content,
    handleDocButton,
    handleBackButton,
    handleDialogOpen,
  }
}
