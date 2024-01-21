'use client'

import { useEffect, useState } from 'react'

import { useApi } from '@/services/api'
import { useChallengeStore } from '@/stores/challengeStore'

export function useDescription() {
  const [isLoading, setIsLoading] = useState(true)
  const setMdx = useChallengeStore((store) => store.actions.setMdx)
  const challenge = useChallengeStore((store) => store.state.challenge)
  const mdx = useChallengeStore((store) => store.state.mdx)
  const api = useApi()

  console.log({ mdx })

  useEffect(() => {
    async function fetchMdx() {
      if (!challenge || mdx) return

      const { texts, description } = challenge

      if (texts) {
        const mdxComponents = await api.parseTexts(texts)
        const compiledMdxComponents = await api.compileDescription(
          mdxComponents.join('')
        )

        setMdx(compiledMdxComponents)
        setIsLoading(false)
        return
      }

      const compiledDescription = await api.compileDescription(description)
      setMdx(compiledDescription)
      setIsLoading(false)
    }

    if (isLoading && mdx) {
      setIsLoading(false)
      return
    }

    fetchMdx()
  }, [isLoading, challenge, api, mdx, setMdx])

  return {
    isLoading,
    mdx,
  }
}
