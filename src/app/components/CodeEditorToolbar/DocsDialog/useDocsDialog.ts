import { useState } from 'react'
import useSWR from 'swr'

import { Doc } from '@/@types/Doc'
import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useApi } from '@/services/api'
import { APP_ERRORS } from '@/utils/constants'

export function useDocsDialog() {
  const { user } = useAuthContext()
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

  function verifyDocUnlocking(doc: Doc, userUnlockedDocsIds: string[]): Doc {
    const isUnlocked = userUnlockedDocsIds.includes(doc.id)

    return { ...doc, isUnlocked }
  }

  async function getDocs() {
    if (!user) return

    const docs = await api.getDocsOrderedByPosition()
    const userUnlockedDocsIds = await api.getUserUnlockedDocsIds(user.id)

    const verifiedDocs = docs.map((doc) =>
      verifyDocUnlocking(doc, userUnlockedDocsIds)
    )

    return verifiedDocs
  }

  const {
    data: docs,
    error,
    isLoading,
  } = useSWR(
    () => (shouldFetchDocs ? `/docs?user_id=${user?.id}` : ''),
    getDocs
  )

  if (error) {
    console.error(error)
    throw new Error(APP_ERRORS.documentation.failedDocsFetching)
  }

  function handleDocButton(docId: string) {
    if (!docs) return

    const docContent = docs.find((doc) => doc.id === docId)?.content

    if (docContent) setContent(docContent)
  }

  return {
    docs,
    isLoading,
    content,
    handleDocButton,
    handleBackButton,
    handleDialogOpen,
  }
}
