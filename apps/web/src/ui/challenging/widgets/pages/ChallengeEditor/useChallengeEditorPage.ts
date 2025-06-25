import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'
import { challengeSchema } from '@stardust/validation/challenging/schemas'
import { DataType } from '@stardust/core/challenging/structures'
import { Challenge } from '@stardust/core/challenging/entities'
import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'

import { ROUTES } from '@/constants'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { useCodeRunner } from '@/ui/global/hooks/useCodeRunner'
import { usePostChallengeAction } from './usePostChallengeAction'

export function useChallengeEditorPage(challengeDto?: ChallengeDto) {
  const challenge = challengeDto ? Challenge.create(challengeDto) : null
  const router = useRouter()
  const difficultyLevel = useMemo(() => {
    if (!challenge) return 'easy'
    if (challenge.difficulty.isAny.isFalse) return challenge.difficulty.level
    return 'easy'
  }, [challenge])
  const { provider } = useCodeRunner()
  const form = useForm<ChallengeSchema>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      title: challenge?.title.value,
      description: challenge?.description.value ?? '',
      code: challenge?.code ?? '',
      difficultyLevel,
      function: {
        name: challenge?.code ? provider.getFunctionName(challenge.code) ?? '' : '',
        params: challenge
          ? provider
              .getFunctionParamsNames(challenge.code)
              .map((paramName: string, paramIndex: number) => ({
                name: paramName,
                dataTypeName: DataType.create(challenge.testCases[0]?.inputs[paramIndex])
                  .name,
              }))
          : [],
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
          id: category.id.value,
          name: category.name.value,
        })) ?? [],
      isPublic:
        typeof challenge?.isPublic === 'undefined' ? false : challenge?.isPublic.value,
    },
  })
  const [isActionSuccess, setisActionSuccess] = useState(false)
  const [isActionFailure, setIsActionFailure] = useState(false)
  const { isPosting, isPostFailure, postChallenge } = usePostChallengeAction({
    onSuccess: (challenge) => handleActionSuccess(challenge, true),
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
      // await editChallenge({ challengeId: challenge.id.value, challenge: formData })
      return
    }
    await postChallenge(formData)
  }

  function handleActionSuccess(challengeSlug: string, isNew: boolean) {
    setisActionSuccess(true)
    const route = ROUTES.challenging.challenges
      .challenge(challengeSlug)
      .concat(isNew ? '?isNew=true' : '')
    router.goTo(route)
  }

  function handleBackButtonClick() {
    router.goBack()
  }

  useEffect(() => {
    if (allFields && !form.formState.isSubmitSuccessful) setisActionSuccess(false)
  }, [allFields, form.formState.isSubmitSuccessful])

  useEffect(() => {
    if (allFields) {
      setIsActionFailure(false)
      return
    }

    setIsActionFailure(isPostFailure || Object.keys(form.formState.errors).length > 0)
  }, [allFields, isPostFailure, form.formState.errors])

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (!name?.includes('function') || !value.function?.params?.length) return
      const functionName = value.function.name
      const functionParamsNames = value.function.params.map((param) => param?.name)
      form.setValue(
        'code',
        `funcao ${functionName}(${functionParamsNames.join(', ')}) {

}`,
      )
    })
    return () => subscription.unsubscribe()
  }, [form.watch, form.setValue])

  const canSubmitForm =
    (!challenge && areAllFieldsFilled) ||
    (Boolean(challenge) && areAllFieldsFilled && form.formState.isDirty)

  return {
    form,
    canSubmitForm,
    shouldEditChallenge: challenge,
    isFormSubmitting: form.formState.isSubmitting || isPosting,
    isActionFailure,
    isActionSuccess,
    handleFormSubmit: form.handleSubmit(handleSubmit),
    handleBackButtonClick,
  }
}
