'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import type { ChallengeDto } from '@stardust/core/challenging/dtos'
import { Challenge } from '@stardust/core/challenging/entities'
import { challengeSchema } from '@stardust/validation/challenging/schemas'
import type { ChallengeSchema } from '@stardust/validation/challenging/types'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { usePostChallengeAction } from './usePostChallengeAction'

export function useChallengeEditorPage(savedChallengeDto?: ChallengeDto) {
  const challenge = savedChallengeDto ? Challenge.create(savedChallengeDto) : null
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  const { user } = useAuthContext()
  const { isPosting, isPostFailure, postChallenge } = usePostChallengeAction({
    onSuccess: () => {
      setIsSubmitSuccess(true)
    },
  })
  const form = useForm<ChallengeSchema>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      title: challenge?.title.value,
      description: challenge?.description.value,
      code: challenge?.code,
      function: {
        name: challenge?.function?.name.value,
        params: challenge?.function?.params.map((param) => ({
          name: param.name.value,
          dataTypeName: param.dataType.name,
        })),
      },
      difficultyLevel: challenge?.difficulty.level,
      testCases: challenge?.testCases.map((testCase) => ({
        isLocked: testCase.isLocked.isTrue,
        expectedOutput: testCase.expectedOutput,
      })),
      categories: challenge?.categories.map((category) => ({
        id: category.id,
        name: category.name.value,
      })),
      authorId: user?.id ?? '',
    },
  })

  const allFields = form.watch()
  const areAllFieldsFilled = [
    allFields.title,
    allFields.difficultyLevel,
    allFields.function.name,
    allFields.description,
    allFields.function.params.length,
    allFields.categories.length,
  ].every(Boolean)

  async function handleSubmit(formData: ChallengeSchema) {
    await postChallenge(formData)
  }

  useEffect(() => {
    if (allFields) setIsSubmitSuccess(false)
  }, [allFields])

  return {
    form,
    canSubmitForm:
      (!challenge && areAllFieldsFilled) ||
      (Boolean(challenge) && form.formState.isDirty),
    shouldUpdateChallenge: challenge || form.formState.isSubmitSuccessful,
    isFormSubmitting: form.formState.isSubmitting || isPosting,
    isSubmitFailure: isPostFailure || !form.formState.isValid,
    isSubmitSuccess: isSubmitSuccess,
    handleFormSubmit: form.handleSubmit(handleSubmit),
  }
}
