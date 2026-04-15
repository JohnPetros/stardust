import type { RefObject } from 'react'

import { Mdx } from '@/ui/global/widgets/components/Mdx'

type Props = {
  ref: RefObject<HTMLDivElement | null>
  chunk: string
  chunkIndex: number
}

export const StoryChunkView = ({ ref, chunk, chunkIndex }: Props) => {
  return (
    <div ref={ref} className='w-full'>
      <Mdx lessonCodeExplanation={{ source: 'story', chunkIndex }}>{chunk}</Mdx>
    </div>
  )
}
