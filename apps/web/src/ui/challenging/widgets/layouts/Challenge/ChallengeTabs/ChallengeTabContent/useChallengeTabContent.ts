import { type RefObject, useEffect } from 'react'

import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'

export function useChallengeTabContent(contentRef: RefObject<HTMLDivElement | null>) {
  const { currentRoute } = useNavigationProvider()

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
