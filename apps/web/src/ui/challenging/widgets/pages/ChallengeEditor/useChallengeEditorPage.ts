'use client'

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'
import { challengeSchema } from '@stardust/validation/challenging/schemas'
import { DataType } from '@stardust/core/challenging/structs'
import { Challenge } from '@stardust/core/challenging/entities'
import type { ChallengeDto } from '@stardust/core/challenging/dtos'

import { ROUTES } from '@/constants'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { usePostChallengeAction } from './usePostChallengeAction'
import { useEditChallengeAction } from './useEditChallengeAction'

export function useChallengeEditorPage(challengeDto?: ChallengeDto) {
  const challenge = challengeDto ? Challenge.create(challengeDto) : null
  const router = useRouter()
  const form = useForm<ChallengeSchema>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      title: challenge?.title.value,
      description: challenge?.description ?? ' ',
      code: challenge?.code ?? ' ',
      difficultyLevel: challenge?.difficulty.level ?? 'easy',
      function: {
        name: challenge?.function?.name.value,
        params:
          challenge?.function?.params.map((param) => ({
            name: param.name.value,
            dataTypeName: param.dataType.name,
          })) ?? [],
      },
      testCases: challenge?.testCases.map((testCase) => {
        const expectedOutputDataType = DataType.create(testCase.expectedOutput)
        return {
          inputs: testCase.inputs.map((inputValue) => ({
            value: inputValue,
          })),
          isLocked: testCase.isLocked.isTrue,
          expectedOutput: {
            dataTypeName: expectedOutputDataType.name,
            value: expectedOutputDataType.value,
          },
        }
      }),
      categories:
        challenge?.categories.map((category) => ({
          id: category.id,
          name: category.name.value,
        })) ?? [],
    },
  })
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  const [isSubmitFailure, setIsSubmitFailure] = useState(false)
  const { isPosting, isPostFailure, postChallenge } = usePostChallengeAction({
    onSuccess: handleActionSuccess,
  })
  const { isEditing, isEditFailure, editChallenge } = useEditChallengeAction({
    onSuccess: handleActionSuccess,
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
      await editChallenge({ challengeId: challenge.id, challenge: formData })
      return
    }
    await postChallenge(formData)
  }

  function handleActionSuccess(challengeSlug: string) {
    setIsSubmitSuccess(true)
    router.goTo(ROUTES.challenging.challenges.challenge(challengeSlug))
  }

  useEffect(() => {
    if (allFields && !form.formState.isSubmitSuccessful) setIsSubmitSuccess(false)
  }, [allFields, form.formState.isSubmitSuccessful])

  useEffect(() => {
    if (allFields) {
      setIsSubmitFailure(false)
      return
    }

    setIsSubmitFailure(
      isPostFailure || isEditFailure || Object.keys(form.formState.errors).length > 0,
    )
  }, [allFields, isPostFailure, isEditFailure, form.formState.errors])

  const canSubmitForm =
    (!challenge && areAllFieldsFilled) ||
    (Boolean(challenge) && areAllFieldsFilled && form.formState.isDirty)

  return {
    form,
    canSubmitForm,
    shouldEditChallenge: challenge,
    isFormSubmitting: form.formState.isSubmitting || isPosting || isEditing,
    isSubmitFailure,
    isSubmitSuccess,
    handleFormSubmit: form.handleSubmit(handleSubmit),
  }
}
