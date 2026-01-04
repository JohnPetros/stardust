'use client'

import { type RefObject, useEffect } from 'react'

import { useInView } from '@/ui/global/hooks/useInView'

type UseInfiniteListParams = {
  onShowMore: () => void
  isReachedEnd: boolean
  isLoading: boolean
  sentinelRef: RefObject<HTMLDivElement | null>
}

export function useInfiniteList({
  onShowMore,
  isReachedEnd,
  isLoading,
  sentinelRef,
}: UseInfiniteListParams) {
  const isInView = useInView(sentinelRef)

  useEffect(() => {
    if (isInView && !isReachedEnd && !isLoading) {
      onShowMore()
    }
  }, [isInView, isReachedEnd, isLoading, onShowMore])
}
