'use client'

import React, { memo } from 'react'

import { Mdx } from '@/ui/global/widgets/components/Mdx'
import { useStoryChunk } from './useStoryChunk'

type StoryChunkProps = {
  value: string
  hasAnimation: boolean
  shouldMemoized: boolean
}

function MemoizedStoryChunk({ value, hasAnimation }: StoryChunkProps) {
  const { storyChunkRef, animatedChunk } = useStoryChunk(value, hasAnimation)

  return (
    <div ref={storyChunkRef} className='w-full'>
      <Mdx>{animatedChunk}</Mdx>
    </div>
  )
}

export const StoryChunk = memo(MemoizedStoryChunk, (_, currentProps) => {
  const isCodeComponent = currentProps.value.slice(0, 5) === '<Code'
  return currentProps.shouldMemoized || isCodeComponent
})
