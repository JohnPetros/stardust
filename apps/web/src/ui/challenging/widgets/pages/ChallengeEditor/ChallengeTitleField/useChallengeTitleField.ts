import { useFormContext } from 'react-hook-form'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'
import { useEffect, useState } from 'react'
import { Slug } from '@stardust/core/global/structures'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'

export function useChallengeTitleField(challengingService: ChallengingService) {
  const [errorMessage, setErrorMessage] = useState('')
  const { formState, register, watch } = useFormContext<ChallengeSchema>()
  const challengeTitle = watch('title')

  useEffect(() => {
    const normalizedTitle = challengeTitle?.trim().toLowerCase()
    const normalizedDefaultTitle = formState.defaultValues?.title?.trim().toLowerCase()
    const shouldSkipValidation =
      !normalizedTitle ||
      normalizedTitle.length <= 2 ||
      normalizedTitle === normalizedDefaultTitle ||
      formState.isSubmitSuccessful

    if (shouldSkipValidation) return

    let isCancelled = false

    async function fetchChallenge() {
      const existingChallengeWithSameSlug = await challengingService.fetchChallengeBySlug(
        Slug.create(challengeTitle),
      )

      if (existingChallengeWithSameSlug.isSuccessful && !isCancelled)
        setErrorMessage('Título já utilizado em outro desafio')
    }

    fetchChallenge()

    return () => {
      isCancelled = true
    }
  }, [challengeTitle, formState.defaultValues?.title, formState.isSubmitSuccessful])

  useEffect(() => {
    if (formState.errors.title?.message) setErrorMessage(formState.errors.title?.message)
  }, [formState.errors.title?.message])

  useEffect(() => {
    if (challengeTitle) setErrorMessage('')
  }, [challengeTitle])

  return {
    registerInput: register,
    errorMessage,
  }
}
