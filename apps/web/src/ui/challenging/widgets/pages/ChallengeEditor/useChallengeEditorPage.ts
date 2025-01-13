'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'
import { challengeSchema } from '@stardust/validation/challenging/schemas'
import { Challenge } from '@stardust/core/challenging/entities'
import type { ChallengeDto } from '@stardust/core/challenging/dtos'

import { usePostChallengeAction } from './usePostChallengeAction'
import { useUpdateChallengeAction } from './useUpdateChallengeAction'

export function useChallengeEditorPage(savedChallengeDto?: ChallengeDto) {
  const challenge = savedChallengeDto ? Challenge.create(savedChallengeDto) : null
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  const { isPosting, isPostFailure, postChallenge } = usePostChallengeAction({
    onSuccess: () => {
      setIsSubmitSuccess(true)
    },
  })
  const { isUpdating, updateChallenge } = useUpdateChallengeAction({
    onSuccess: () => {
      setIsSubmitSuccess(true)
    },
  })
  const form = useForm<ChallengeSchema>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      title: challenge?.title.value,
      description: challenge?.description ?? 'oiiiiiiii',
      code: challenge?.code ?? ' ',
      function: {
        name: challenge?.function?.name.value,
        params:
          challenge?.function?.params.map((param) => ({
            name: param.name.value,
            dataTypeName: param.dataType.name,
          })) ?? [],
      },
      difficultyLevel: challenge?.difficulty.level,
      testCases: challenge?.testCases.map((testCase) => ({
        inputs: testCase.inputs.map((inputValue) => ({
          value: inputValue,
        })),
        isLocked: testCase.isLocked.isTrue,
        expectedOutput: testCase.expectedOutput,
      })),
      categories:
        challenge?.categories.map((category) => ({
          id: category.id,
          name: category.name.value,
        })) ?? [],
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
    if (challenge) {
      await updateChallenge({ challengeId: challenge.id, challenge: formData })
      return
    }

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
    isFormSubmitting: form.formState.isSubmitting || isPosting || isUpdating,
    isSubmitFailure: isPostFailure || Object.keys(form.formState.errors).length > 0,
    isSubmitSuccess: isSubmitSuccess,
    handleFormSubmit: form.handleSubmit(handleSubmit),
  }
}
