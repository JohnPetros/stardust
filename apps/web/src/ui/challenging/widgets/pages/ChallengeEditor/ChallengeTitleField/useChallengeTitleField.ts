import { useFormContext } from 'react-hook-form'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'
import { useEffect, useState } from 'react'
import { useApi } from '@/ui/global/hooks/useApi'
import { Slug } from '@stardust/core/global/structures'

export function useChallengeTitleField() {
  const [errorMessage, setErrorMessage] = useState('')
  const { formState, register, watch } = useFormContext<ChallengeSchema>()
  const api = useApi()
  const challengeTitle = watch('title')

  useEffect(() => {
    setErrorMessage('')
    if (
      !challengeTitle ||
      challengeTitle?.length <= 2 ||
      formState.defaultValues?.title?.trim().toLowerCase() ===
        challengeTitle.trim().toLowerCase()
    )
      return

    async function fetchChallenge() {
      const existingChallengeWithSameSlug = await api.fetchChallengeBySlug(
        Slug.create(challengeTitle).value,
      )
      if (existingChallengeWithSameSlug.isSuccessful)
        setErrorMessage('Título já utilizado em outro desafio')
    }

    fetchChallenge()
  }, [challengeTitle, formState.defaultValues?.title, api.fetchChallengeBySlug])

  useEffect(() => {
    if (formState.errors.title?.message) setErrorMessage(formState.errors.title?.message)
  }, [formState.errors.title?.message])

  return {
    registerInput: register,
    errorMessage,
  }
}
