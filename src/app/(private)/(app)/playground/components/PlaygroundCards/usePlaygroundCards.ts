'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Playground } from '@/@types/Playground'
import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { CACHE } from '@/global/constants/cache'
import { useApi } from '@/services/api'
import { useCache } from '@/services/cache'

export function usePlaygroundCards(initialPlaygrounds: Playground[]) {
  const api = useApi()
  const { user } = useAuthContext()
  const router = useRouter()

  async function getPlaygroundCards() {
    if (!user?.slug) return

    try {
      return await api.getPlaygroundsByUserSlug(user.slug)
    } catch (error) {
      console.error(error)
    }
  }

  const {
    data: playgroundCards,
    mutate,
    isLoading,
  } = useCache({
    key: CACHE.keys.playgroundCards,
    fetcher: getPlaygroundCards,
    initialData: initialPlaygrounds,
  })

  function handleDeletePlaygroundCard(deletedPlaygroundId: string) {
    if (playgroundCards)
      mutate(
        playgroundCards.filter(
          (playgroundCard) => playgroundCard.id !== deletedPlaygroundId
        )
      )
  }

  useEffect(() => {
    router.refresh()
  }, [router])

  return {
    playgroundCards,
    isLoading,
    handleDeletePlaygroundCard,
  }
}
