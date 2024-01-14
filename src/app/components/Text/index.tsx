import { useText } from './useText'

import type { Text as TextData } from '@/@types/text'
import { Mdx } from '@/app/components/Mdx'

type TextProp = {
  id: string
  data: TextData
}

export function Text({ id, data }: TextProp) {
  const { content, textRef } = useText(data)

  return (
    <div ref={textRef}>
      <Mdx id={id}>{content}</Mdx>
    </div>
  )
}
