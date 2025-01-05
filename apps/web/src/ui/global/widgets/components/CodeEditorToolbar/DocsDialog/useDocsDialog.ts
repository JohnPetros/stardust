import { useState } from 'react'
import { CACHE } from '@/constants'
import { useApi, useCache } from '@/ui/global/hooks'
import { Doc } from '@stardust/core/challenging/entities'

export function useDocsDialog() {
  const api = useApi()
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
    const response = await api.fetchDocs()
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
