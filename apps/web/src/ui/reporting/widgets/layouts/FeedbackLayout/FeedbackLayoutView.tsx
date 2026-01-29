'use client'

import type { ReactNode } from 'react'

import { FeedbackDialog } from './FeedbackDialog'

type Props = {
  children: ReactNode
}

export const FeedbackLayoutView = ({ children }: Props) => {
  return (
    <div className='relative flex h-screen w-screen overflow-hidden'>
      <div className='flex-1 overflow-auto'>{children}</div>
      <FeedbackDialog />
    </div>
  )
}
