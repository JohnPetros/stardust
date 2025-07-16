import { memo, type RefObject } from 'react'

import { Mdx } from '@/ui/global/widgets/components/Mdx'

type Props = {
  content: string
  shouldMemoized: boolean
  textBlockMdxRef: RefObject<HTMLDivElement | null>
  mdxTemplate: string
}

const View = ({ textBlockMdxRef, mdxTemplate }: Props) => {
  return (
    <div ref={textBlockMdxRef}>
      <Mdx>{mdxTemplate}</Mdx>
    </div>
  )
}

export const TextBlockMdxView = memo(View, (_, currentProps) => {
  const isCodeComponent = currentProps.content.slice(0, 5) === '<Code'
  return currentProps.shouldMemoized || isCodeComponent
})
