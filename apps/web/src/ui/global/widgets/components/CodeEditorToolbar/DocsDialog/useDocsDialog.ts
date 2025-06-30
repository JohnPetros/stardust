import { useState } from 'react'

import type { DocumentationService } from '@stardust/core/documentation/interfaces'
import { Doc } from '@stardust/core/challenging/entities'

import { CACHE } from '@/constants'
import { useCache } from '@/ui/global/hooks/useCache'

export function useDocsDialog(documentationService: DocumentationService) {
  const [content, setContent] = useState('')
  const [shouldFetchDocs, setShouldFetchDocs] = useState(false)

  function handleDialogOpen(isOpen: boolean) {
    if (isOpen && !shouldFetchDocs) {
      setShouldFetchDocs(true)
    }
  }

  function handleDocButtonClick(docId: string) {
    if (!docs) return
    const docContent = docs.find((doc) => doc.id === docId)?.content
    if (docContent) setContent(docContent)
  }

  function handleBackButtonClick() {
    setContent('')
  }

  async function fetchDocs() {
    const response = await documentationService.fetchAllDocs()
    if (response.isFailure) response.throwError()
    return response.body
  }

  const { data: docs, isLoading } = useCache({
    key: CACHE.keys.docs,
    fetcher: fetchDocs,
  })

  return {
    docs: docs ? docs.map(Doc.create) : [],
    isLoading,
    content,
    handleDocButtonClick,
    handleBackButtonClick,
    handleDialogOpen,
  }
}
