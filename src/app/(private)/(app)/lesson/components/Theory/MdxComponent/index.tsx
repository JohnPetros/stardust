import React, { memo } from 'react'

import { useMdxComponent } from './useMdxComponent'

import { Mdx } from '@/global/components/Mdx'

type MdxTextProps = {
  content: string
  hasAnimation: boolean
  shouldMemoized: boolean
}

function MemoizedMdxComponent({ content, hasAnimation }: MdxTextProps) {
  const { mdxComponentRef, mdxContent } = useMdxComponent(content, hasAnimation)

  return (
    <div ref={mdxComponentRef}>
      <Mdx>{mdxContent}</Mdx>
    </div>
  )
}

export const MdxComponent = memo(MemoizedMdxComponent, (_, currentProps) => {
  const isCodeComponent = currentProps.content.slice(0, 5) === '<Code'
  return currentProps.shouldMemoized || isCodeComponent
})
