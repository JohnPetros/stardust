import { type RefObject, useEffect } from 'react'

import { useRouter } from '@/ui/global/hooks/useRouter'

export function useChallengeTabContent(contentRef: RefObject<HTMLDivElement>) {
  const { currentRoute } = useRouter()

  useEffect(() => {
    if (currentRoute && contentRef.current)
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'instant',
      })
  }, [currentRoute, contentRef.current])
}
