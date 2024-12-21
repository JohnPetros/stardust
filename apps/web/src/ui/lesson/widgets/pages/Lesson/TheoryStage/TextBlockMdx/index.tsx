'use client'

import React, { memo } from 'react'

import { useTextBlockMdx } from './useTextBlockMdx'
import { Mdx } from '@/ui/global/widgets/components/Mdx'

type MdxTextProps = {
  content: string
  hasAnimation: boolean
  shouldMemoized: boolean
}

function MemoizedTextBlockMdx({ content, hasAnimation }: MdxTextProps) {
  const { textBlockMdxRef, mdxTemplate } = useTextBlockMdx(content, hasAnimation)

  return (
    <div ref={textBlockMdxRef}>
      <Mdx>{mdxTemplate}</Mdx>
    </div>
  )
}

export const TextBlockMdx = memo(MemoizedTextBlockMdx, (_, currentProps) => {
  const isCodeComponent = currentProps.content.slice(0, 5) === '<Code'
  return currentProps.shouldMemoized || isCodeComponent
})
