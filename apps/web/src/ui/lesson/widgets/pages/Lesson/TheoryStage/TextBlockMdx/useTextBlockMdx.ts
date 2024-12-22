'use client'

import { useEffect, useRef } from 'react'

export function useTextBlockMdx(template: string, hasAnimation: boolean) {
  const textBlockMdxRef = useRef<HTMLDivElement>(null)

  const mdxTemplate = template.replace(
    'hasAnimation={false}',
    `hasAnimation={${hasAnimation}}`,
  )

  useEffect(() => {
    if (hasAnimation && textBlockMdxRef.current) {
      textBlockMdxRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      })
    }
  }, [hasAnimation])

  return {
    textBlockMdxRef,
    mdxTemplate,
  }
}
