'use client'

import { useTextBlockMdx } from './useTextBlockMdx'
import { TextBlockMdxView } from './TextBlockMdxView'

type Props = {
  content: string
  hasAnimation: boolean
  shouldMemoized: boolean
}

export const TextBlockMdx = ({ content, hasAnimation, shouldMemoized }: Props) => {
  const { textBlockMdxRef, mdxTemplate } = useTextBlockMdx(content, hasAnimation)

  return (
    <TextBlockMdxView
      content={content}
      shouldMemoized={shouldMemoized}
      textBlockMdxRef={textBlockMdxRef}
      mdxTemplate={mdxTemplate}
    />
  )
}
