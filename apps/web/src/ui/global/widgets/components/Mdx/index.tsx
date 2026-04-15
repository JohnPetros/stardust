'use client'

import { memo, useMemo } from 'react'

import { useMdx } from './hooks/useMdx'
import { MdxView } from './MdxView'
import type { LessonCodeExplanation } from '../CodeSnippet'

type MdxProps = {
  children: string
  lessonCodeExplanation?: LessonCodeExplanation
}

export const Mdx = memo(({ children, lessonCodeExplanation }: MdxProps) => {
  const { formatCodeContent } = useMdx()
  const content = useMemo(
    () => formatCodeContent(children),
    [children, formatCodeContent],
  )

  return <MdxView lessonCodeExplanation={lessonCodeExplanation}>{content}</MdxView>
})
