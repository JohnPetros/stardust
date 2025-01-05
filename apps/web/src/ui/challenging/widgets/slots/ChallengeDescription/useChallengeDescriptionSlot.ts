'use client'

import { useEffect, useState } from 'react'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useMdx } from '@/ui/global/widgets/components/Mdx/hooks/useMdx'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useRouter } from '@/ui/global/hooks'
import { ROUTES } from '@/constants'

const description = `
Em um planeta distante da galáxia, os habitantes da Terra foram desafiados a calcular a área de um triângulo que representa o escudo protetor da cidade espacial.

Sua tarefa é calcular a área desse triângulo analisando sua base e altura.

Exemplo 1:

<Quote>Entrada: *base = 3, altura = 2*</Quote>
<Quote>Saída: *3*</Quote>

Exemplo 2:

<Quote>Entrada: *base = 7, altura = 4*</Quote>
<Quote>Saída: *14*</Quote>

Exemplo 3:

<Quote>Entrada: *base = 10, altura = 10*</Quote>
<Quote>Saída: *50*</Quote>

> Lembre-se: a área de um triângulo é base vezes a altura dividido por 2.

<Alert>Não são se esqueça de usar o \"retorna\" na função e também de não alterar o nome e os parâmetros da função que colocamos 😁</Alert>`

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
