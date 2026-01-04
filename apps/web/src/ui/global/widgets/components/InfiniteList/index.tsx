'use client'

import { useRef } from 'react'

import { InfiniteListView, type InfiniteListViewProps } from './InfiniteListView'
import { useInfiniteList } from './useInfiniteList'

export type InfiniteListProps = Omit<InfiniteListViewProps, 'sentinelRef'> & {
  onShowMore: () => void
  isLoading?: boolean
}

export const InfiniteList = ({
  onShowMore,
  isReachedEnd = false,
  isLoading = false,
  ...restProps
}: InfiniteListProps) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  useInfiniteList({
    onShowMore,
    isReachedEnd,
    isLoading,
    sentinelRef,
  })

  return (
    <InfiniteListView
      {...restProps}
      isReachedEnd={isReachedEnd}
      sentinelRef={sentinelRef}
    />
  )
}
