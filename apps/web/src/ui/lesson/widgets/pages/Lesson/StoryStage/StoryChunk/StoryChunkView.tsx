import type { RefObject } from 'react'

import { Mdx } from '@/ui/global/widgets/components/Mdx'

type Props = {
  ref: RefObject<HTMLDivElement | null>
  chunk: string
}

export const StoryChunkView = ({ ref, chunk }: Props) => {
  return (
    <div ref={ref} className='w-full'>
      <Mdx>{chunk}</Mdx>
    </div>
  )
}
