'use client'

import { useEffect, useState } from 'react'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useMdx } from '@/ui/global/widgets/components/Mdx/hooks/useMdx'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { ROUTES } from '@/constants'

export function useChallengeDescriptionSlot() {
  const [isLoading, setIsLoading] = useState(true)
  const { getChallengeSlice, getCraftsVisibilitySlice, getMdxSlice } = useChallengeStore()
  const { mdx, setMdx } = getMdxSlice()
  const { challenge } = getChallengeSlice()
  const { craftsVislibility, setCraftsVislibility } = getCraftsVisibilitySlice()
  const { parseTextBlocksToMdx } = useMdx()
  const { user, updateUser } = useAuthContext()
  const { goTo } = useRouter()

  async function handleShowSolutions() {
    if (!user || !challenge) return

    user.unlockChallengeSolutions(challenge.id)
    await updateUser(user)
    setCraftsVislibility(craftsVislibility.showSolutions())
    goTo(`${ROUTES.challenging.challenges}/${challenge?.slug}/solutions`)
  }

  useEffect(() => {
    if (mdx) {
      setIsLoading(false)
      return
    }

    async function fetchMdx() {
      if (!challenge) return

      if (challenge.description) {
        setMdx(challenge.description)
        return
      }

      if (challenge.textBlocks) {
        const mdxComponents = parseTextBlocksToMdx(challenge.textBlocks)

        setMdx(mdxComponents.join('<br />'))
        setIsLoading(false)
        return
      }
    }

    if (isLoading && mdx) {
      setIsLoading(false)
      return
    }

    fetchMdx()
  }, [isLoading, challenge, mdx, setMdx, parseTextBlocksToMdx])

  return {
    isLoading,
    user,
    mdx,
    challenge,
    handleShowSolutions,
  }
}
