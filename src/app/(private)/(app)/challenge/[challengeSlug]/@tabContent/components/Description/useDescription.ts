'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useMdx } from '@/global/hooks/useMdx'
import { useChallengeStore } from '@/stores/challengeStore'
import { ROUTES } from '@/global/constants'

export function useDescription() {
  const [isLoading, setIsLoading] = useState(true)

  const setMdx = useChallengeStore((store) => store.actions.setMdx)
  const setCanShowSolutions = useChallengeStore(
    (store) => store.actions.setCanShowSolutions
  )
  const challenge = useChallengeStore((store) => store.state.challenge)
  const userVote = useChallengeStore((store) => store.state.userVote)
  const mdx = useChallengeStore((store) => store.state.mdx)

  const router = useRouter()

  const { user, updateUser } = useAuthContext()

  const { parseTextsToMdxComponents } = useMdx()

  async function handleShowSolutions() {
    if (!user) return

    await updateUser({ coins: user.coins - 10 })
    setCanShowSolutions(true)
    router.push(`${ROUTES.private.challenge}/${challenge?.slug}/solutions`)
  }

  useEffect(() => {
    if (mdx) {
      setIsLoading(false)
      return
    }

    async function fetchMdx() {
      if (!challenge) return

      const { texts, description } = challenge

      if (texts) {
        const mdxComponents = parseTextsToMdxComponents(texts)

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
