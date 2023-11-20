'use client'

import { useCallback, useEffect, useState } from 'react'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

import { useApi } from '@/services/api'

export function useMdx(content: string) {
  const api = useApi()
  const [source, setSource] = useState<MDXRemoteSerializeResult | null>(null)

  const fetchSource = useCallback(async () => {
    const source = await api.compileMdx(content)

    setSource(source)
  }, [content])

  useEffect(() => {
    fetchSource()
  }, [fetchSource])

  return source
}
