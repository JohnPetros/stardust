'use client'

import type { ReactNode, RefObject } from 'react'
import { twMerge } from 'tailwind-merge'

import { Loading } from '../Loading'

export type InfiniteListViewProps = {
  children: ReactNode
  isReachedEnd?: boolean
  className?: string
  sentinelClassName?: string
  loader?: ReactNode
  sentinelRef: RefObject<HTMLDivElement | null>
}

export const InfiniteListView = ({
  children,
  className,
  sentinelClassName,
  loader = <Loading />,
  isReachedEnd = false,
  sentinelRef,
}: InfiniteListViewProps) => {
  return (
    <div className={className}>
      {children}

      {!isReachedEnd && (
        <div
          ref={sentinelRef}
          className={twMerge('flex justify-center p-4', sentinelClassName)}
        >
          {loader}
        </div>
      )}
    </div>
  )
}
