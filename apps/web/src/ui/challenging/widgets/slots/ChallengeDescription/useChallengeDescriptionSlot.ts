'use client'

import { useEffect, useState } from 'react'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { ROUTES } from '@/constants'
import { useCodeRunner } from '@/ui/global/hooks/useCodeRunner'

export function useChallengeDescriptionSlot() {
  const [isLoading, setIsLoading] = useState(true)
  const { getChallengeSlice, getCraftsVisibilitySlice, getMdxSlice } = useChallengeStore()
  const { mdx, setMdx } = getMdxSlice()
  const { challenge } = getChallengeSlice()
  const { craftsVislibility, setCraftsVislibility } = getCraftsVisibilitySlice()
  const { user, updateUser } = useAuthContext()
  const { goTo } = useRouter()
  const { provider } = useCodeRunner()

  async function handleShowSolutions() {
    if (!user || !challenge) return

    user.unlockChallengeSolutions(challenge.id)
    await updateUser(user)
    setCraftsVislibility(craftsVislibility.showSolutions())
    goTo(ROUTES.challenging.challenges.challengeSolutions.list(challenge.slug.value))
  }

  useEffect(() => {
    if (mdx) {
      setIsLoading(false)
      return
    }

    if (isLoading && mdx) {
      setIsLoading(false)
      return
    }

    if (!challenge) return

    const hasFunction = provider.getFunctionName(challenge.code)

    const alertText = hasFunction
      ? '<Alert>Você deve `retornar` a resposta utilizando a função que já existe no código ao lado. Então por favor não altere o nome da função nem os seus parâmetros, senão não será possível validar seu desafio!</Alert>'
      : '<Alert>Por favor, não remova nenhum comando *leia()*, pois será a partir deles que virão os dados para o seu programa.</Alert>'

    setMdx(challenge.description.value.concat(alertText))
  }, [isLoading, challenge, mdx, setMdx, provider.getFunctionName])

  return {
    isLoading,
    mdx,
    challenge,
    isUserChallengeAuthor: Boolean(challenge?.authorId === user?.id),
    isCompleted:
      challenge && user ? user.hasCompletedChallenge(challenge.id).isTrue : false,
    handleShowSolutions,
  }
}
