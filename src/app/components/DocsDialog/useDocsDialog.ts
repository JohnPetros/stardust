import { useState } from 'react'
import useSWR from 'swr'

import { Doc } from '@/@types/doc'
import { useAuth } from '@/contexts/AuthContext'
import { useApi } from '@/services/api'
import { ERRORS } from '@/utils/constants'

export function useDocsDialog() {
  const { user } = useAuth()
  const api = useApi()
  const [content, setContent] = useState('')

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

    return docs.map((doc) => verifyDocUnlocking(doc, userUnlockedDocsIds))
  }

  const {
    data: docs,
    error,
    isLoading,
  } = useSWR(() => `/docs?user_id=${user?.id}`, getDocs)

  if (error) {
    console.error(error)
    throw new Error(ERRORS.dictionary.failedDocsFetching)
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
  }
}
