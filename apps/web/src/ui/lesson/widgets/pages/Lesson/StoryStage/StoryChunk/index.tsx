'use client'

import { memo } from 'react'

import { useStoryChunk } from './useStoryChunk'
import { StoryChunkView } from './StoryChunkView'

type Props = {
  value: string
  hasAnimation: boolean
  shouldMemoized: boolean
}

const Widget = ({ value, hasAnimation }: Props) => {
  const { storyChunkRef, animatedChunk } = useStoryChunk(value, hasAnimation)

  return <StoryChunkView ref={storyChunkRef} chunk={animatedChunk} />
}

export const StoryChunk = memo(Widget, (_, currentProps) => {
  const isCodeWidget = currentProps.value.slice(0, 5) === '<Code'
  return currentProps.shouldMemoized || isCodeWidget
})
