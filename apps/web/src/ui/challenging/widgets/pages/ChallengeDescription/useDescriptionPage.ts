'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useMdx } from '@/ui/global/widgets/components/Mdx/useMdx'
import { ROUTES } from '@/constants'

export function useChallengeDescriptionPage() {
  const [isLoading, setIsLoading] = useState(true)

  const { getChallengeSlice, getCraftsVisibilitySlice } = useChallengeStore()
  const { challenge } = getChallengeSlice()
  const { craftsVislibility } = getCraftsVisibilitySlice()
  const setMdx = useChallengeStore((store) => store.actions.setMdx)
  const mdx = useChallengeStore((store) => store.state.mdx)

  const { parseTextBlocksToMdx } = useMdx()

  useEffect(() => {
    if (mdx) {
      setIsLoading(false)
      return
    }

    async function fetchMdx() {
      if (!challenge) return

      const { texts, description } = challenge

      if (texts) {
        const mdxComponents = parseTextBlocksToMdx(texts)

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
  }, [isLoading, challenge, mdx, setMdx, parseTextsToMdxComponents])

  return {
    isLoading,
    mdx,
    userVote,
    challenge,
    handleShowSolutions,
  }
}
