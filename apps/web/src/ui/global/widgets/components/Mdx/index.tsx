'use client'

import { useMdx } from './hooks/useMdx'
import { MdxView } from './MdxView'

type MdxProps = {
  children: string
}

export const Mdx = ({ children }: MdxProps) => {
  const { formatCodeContent } = useMdx()
  const content = formatCodeContent(children)

  return <MdxView>{content}</MdxView>
}
