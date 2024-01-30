'use client'

import { useEffect, useState } from 'react'

import { useMdx } from '@/hooks/useMdx'
import { useChallengeStore } from '@/stores/challengeStore'

export function useDescription() {
  const [isLoading, setIsLoading] = useState(true)

  const setMdx = useChallengeStore((store) => store.actions.setMdx)
  const challenge = useChallengeStore((store) => store.state.challenge)
  const userVote = useChallengeStore((store) => store.state.userVote)
  const mdx = useChallengeStore((store) => store.state.mdx)

  const { parseTexts } = useMdx()

  useEffect(() => {
    if (mdx) {
      setIsLoading(false)
      return
    }

    async function fetchMdx() {
      if (!challenge) return

      const { texts, description } = challenge

      if (texts) {
        const mdxComponents = parseTexts(texts)

        setMdx(mdxComponents.join('<br />'))
        setIsLoading(false)
        return
      }

      setMdx(description)
    }

    if (isLoading && mdx) {
      setIsLoading(false)
      return
    }

    fetchMdx()
  }, [isLoading, challenge, mdx, setMdx, parseTexts])

  return {
    isLoading,
    mdx,
    userVote,
    challenge,
  }
}
