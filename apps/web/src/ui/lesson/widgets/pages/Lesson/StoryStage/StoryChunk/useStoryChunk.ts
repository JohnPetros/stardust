import { useEffect, useRef } from 'react'

export function useStoryChunk(chunk: string, hasAnimation: boolean) {
  const storyChunkRef = useRef<HTMLDivElement>(null)
  const animatedChunk = chunk.replace('>', ` hasAnimation={${hasAnimation}}>`)

  useEffect(() => {
    if (hasAnimation && storyChunkRef.current) {
      storyChunkRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      })
    }
  }, [hasAnimation])

  return {
    storyChunkRef,
    animatedChunk,
  }
}
