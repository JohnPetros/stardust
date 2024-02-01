'use client'

import { useEffect, useRef } from 'react'

export function useMdxComponent(content: string, hasAnimation: boolean) {
  const mdxComponentRef = useRef<HTMLDivElement>(null)

  console.log({ content })

  const mdxContent = content.replace(
    'hasAnimation={false}',
    `hasAnimation={${hasAnimation}}`
  )

  useEffect(() => {
    if (hasAnimation && mdxComponentRef.current) {
      mdxComponentRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      })
    }
  }, [hasAnimation])

  return {
    mdxComponentRef,
    mdxContent,
  }
}
