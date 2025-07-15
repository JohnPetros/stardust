import { type RefObject, useEffect } from 'react'

import { useRouter } from '@/ui/global/hooks/useRouter'

export function useChallengeTabContent(contentRef: RefObject<HTMLDivElement | null>) {
  const { currentRoute } = useRouter()

  useEffect(() => {
    if (currentRoute && contentRef.current)
      setTimeout(() => {
        contentRef.current?.scrollTo({
          top: 0,
          behavior: 'instant',
        })
      }, 500)
  }, [currentRoute, contentRef.current])
}
