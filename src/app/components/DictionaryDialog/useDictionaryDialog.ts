import useSWR from 'swr'

import { DictionaryTopic } from '@/@types/dictionaryTopic'
import { useAuth } from '@/contexts/AuthContext'
import { useApi } from '@/services/api'
import { ERRORS } from '@/utils/constants'

export function useDictionaryDialog() {
  const { user } = useAuth()
  const api = useApi()

  function verifyTopicUnlocking(
    topic: DictionaryTopic,
    userUnlockedTopicsIds: string[]
  ) {
    const isUnlocked = userUnlockedTopicsIds.includes(topic.id)

    return { ...topic, isUnlocked }
  }

  async function getDictionaryTopics() {
    if (!user) return

    const topics = await api.getDictionaryTopicsOrderedByPosition()
    const userUnlockedTopicsIds = await api.getUserUnlockedDictionaryTopicsIds(
      user.id
    )

    return topics.map((topic) =>
      verifyTopicUnlocking(topic, userUnlockedTopicsIds)
    )
  }

  const {
    data: topics,
    error,
    isLoading,
  } = useSWR(() => `/topics?user_id=${user?.id}`, getDictionaryTopics)

  if (error) {
    console.error(error)
    throw new Error(error)
  }

  return {
    topics,
    isLoading,
  }
}
