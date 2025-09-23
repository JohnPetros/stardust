import { useEffect, useState } from 'react'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useLsp } from '@/ui/global/hooks/useLsp'
import type { User } from '@stardust/core/profile/entities'

export function useChallengeDescriptionSlot(user: User | null) {
  const [isLoading, setIsLoading] = useState(true)
  const { getChallengeSlice, getMdxSlice } = useChallengeStore()
  const { mdx, setMdx } = getMdxSlice()
  const { challenge } = getChallengeSlice()
  const { lspProvider } = useLsp()

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

    const hasFunction = lspProvider.getFunctionName(challenge.code)

    const alertText = hasFunction
      ? '<Alert>Você deve `retornar` a resposta utilizando a função que já existe no código ao lado. Então por favor não altere o nome da função nem os seus parâmetros, senão não será possível validar seu desafio!</Alert>'
      : '<Alert>Por favor, não remova nenhum comando *leia()*, pois será a partir deles que virão os dados para o seu programa.</Alert>'

    setMdx(challenge.description.value.concat(alertText))
  }, [isLoading, challenge, mdx, setMdx, lspProvider.getFunctionName])

  return {
    isLoading,
    mdx,
    challenge,
    isUserChallengeAuthor:
      user && challenge ? challenge.author.isEqualTo(user).isTrue : false,
    isCompleted:
      user && challenge
        ? user.hasCompletedChallenge(challenge.id).or(challenge.isCompleted).isTrue
        : false,
  }
}
