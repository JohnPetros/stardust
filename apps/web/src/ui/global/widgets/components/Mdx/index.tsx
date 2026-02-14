'use client'

import { memo, useMemo } from 'react'

import { useMdx } from './hooks/useMdx'
import { MdxView } from './MdxView'

type MdxProps = {
  children: string
}

export const Mdx = memo(({ children }: MdxProps) => {
  const { formatCodeContent } = useMdx()
  const content = useMemo(
    () => formatCodeContent(children),
    [children, formatCodeContent],
  )

  return <MdxView>{content}</MdxView>
})
