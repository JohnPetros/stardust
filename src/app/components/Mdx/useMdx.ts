'use client'

import { useEffect, useState } from 'react'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

import { useApi } from '@/services/api'

export function useMdx(content: string) {
  const api = useApi()
  const [source, setSource] = useState<MDXRemoteSerializeResult | null>(null)

  console.log({ content })

  useEffect(() => {
    let isMounted = true

    async function fetchSource() {
      try {
        const source = await api.compileMdx(content)

        setSource(source)
      } catch (error) {
        console.error(error)
      }
    }

    if (isMounted) fetchSource()

    return () => {
      isMounted = false
    }
  }, [content, api])

  return source
}
