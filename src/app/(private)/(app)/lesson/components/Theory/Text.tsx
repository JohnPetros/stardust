'use client'

import { useEffect, useRef } from 'react'

import type { Text as TextData } from '@/@types/text'
import { Mdx } from '@/app/components/Mdx'
import { useText } from '@/hooks/useText'

interface TextProp {
  id: string
  data: TextData
}

export function Text({ id, data }: TextProp) {
  const { parseTextToMdx } = useText()
  const content = parseTextToMdx(data, Boolean(data.hasAnimation))
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (data.hasAnimation && textRef.current)
      textRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [data.hasAnimation])

  return (
    <div ref={textRef}>
      <Mdx id={id}>{content}</Mdx>
    </div>
  )
}
