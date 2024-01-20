'use client'

import { useEffect, useState } from 'react'

import { useApi } from '@/services/api'
import { useChallengeStore } from '@/stores/challengeStore'

export function useDescription() {
  const [mdx, setMdx] = useState('')
  const challenge = useChallengeStore((store) => store.state.challenge)
  const api = useApi()

  useEffect(() => {
    async function fetchMdx() {
      if (!challenge) return

      const { texts, description } = challenge

      if (texts) {
        const mdxComponents = await api.parseTexts(texts)
        const compiledMdxComponents = await api.compileDescription(
          mdxComponents.join('')
        )

        setMdx(compiledMdxComponents)

        return
      }

      const compiledDescription = await api.compileDescription(description)
      setMdx(compiledDescription)
    }

    fetchMdx()
  }, [challenge, api])

  return {
    mdx,
  }
}
