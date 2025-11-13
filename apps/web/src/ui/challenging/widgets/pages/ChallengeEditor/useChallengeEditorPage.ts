import { useEffect, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import type { ChallengeSchema } from '@stardust/validation/challenging/types'
import { challengeFormSchema } from '@stardust/validation/challenging/schemas'
import { DataType } from '@stardust/core/challenging/structures'
import { Challenge } from '@stardust/core/challenging/entities'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { Id } from '@stardust/core/global/structures'
import type { NavigationProvider, ToastProvider } from '@stardust/core/global/interfaces'

import { ROUTES } from '@/constants'
import { useLsp } from '@/ui/global/hooks/useLsp'

type Params = {
  currentChallenge: Challenge | null
  userId: Id
  service: ChallengingService
  navigationProvider: NavigationProvider
  toastProvider: ToastProvider
}

export function useChallengeEditorPage({
  currentChallenge,
  service,
  navigationProvider,
  toastProvider,
  userId,
}: Params) {
  const difficultyLevel = useMemo(() => {
    if (!currentChallenge) return 'easy'
    if (currentChallenge.difficulty.isAny.isFalse)
      return currentChallenge.difficulty.level
    return 'easy'
  }, [currentChallenge])
  const { lspProvider } = useLsp()
  const form = useForm<ChallengeSchema>({
    resolver: zodResolver(challengeFormSchema),
    defaultValues: {
      title: currentChallenge?.title.value,
      description: currentChallenge?.description.value ?? '',
      code: currentChallenge?.code ?? '',
      difficultyLevel,
      author: {
        id: userId.value,
      },
      function: {
        name: currentChallenge?.code
          ? (lspProvider.getFunctionName(currentChallenge.code) ?? '')
          : '',
        params: currentChallenge
          ? lspProvider
              .getFunctionParamsNames(currentChallenge.code)
              .map((paramName: string, paramIndex: number) => ({
                name: paramName,
                dataTypeName: DataType.create(
                  currentChallenge.testCases[0]?.inputs[paramIndex],
                ).name,
              }))
          : [],
      },
      testCases: currentChallenge?.testCases.map((testCase) => {
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
        currentChallenge?.categories.map((category) => ({
          id: category.id.value,
          name: category.name.value,
        })) ?? [],
      isPublic:
        typeof currentChallenge?.isPublic === 'undefined'
          ? false
          : currentChallenge?.isPublic.value,
    },
  })
  const [isActionSuccess, setisActionSuccess] = useState(false)
  const [isActionFailure, setIsActionFailure] = useState(false)

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
    const challenge = Challenge.create({
      title: formData.title,
      code: formData.code,
      description: formData.description,
      difficultyLevel: formData.difficultyLevel,
      author: {
        id: userId.value,
      },
      testCases: formData.testCases.map((testCase, index) => ({
        position: index + 1,
        inputs: testCase.inputs.map((input) => input.value),
        isLocked: testCase.isLocked,
        expectedOutput: testCase.expectedOutput.value,
      })),
      categories: formData.categories,
    })


    if (currentChallenge) {
      const updatedChallenge = Challenge.create({ 
        ...challenge.dto,
        id: currentChallenge.id.value
      })
      const response = await service.updateChallenge(updatedChallenge)
      if (response.isFailure) {
        setIsActionFailure(true)
        return
      }
      if (response.isSuccessful) handleActionSuccess(challenge.slug.value, false)
      return
    }

    const response = await service.postChallenge(challenge)

    if (response.isFailure) {
      setIsActionFailure(true)
      return
    }

    if (response.isSuccessful && response.body.slug)
      handleActionSuccess(response.body.slug, true)
  }

  function handleActionSuccess(challengeSlug: string, isNew: boolean) {
    setisActionSuccess(true)
    const route = ROUTES.challenging.challenges
      .challenge(challengeSlug)
      .concat(isNew ? '?isNew=true' : '')
    navigationProvider.goTo(route)
  }

 async function handleDeleteChallengeButtonClick() {
    if (!currentChallenge) return
    const response = await service.deleteChallenge(currentChallenge)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }
    navigationProvider.goTo(ROUTES.challenging.challenges.list)
  }

  function handleBackButtonClick() {
    navigationProvider.goBack()
  }

  useEffect(() => {
    if (allFields && !form.formState.isSubmitSuccessful) setisActionSuccess(false)
  }, [allFields, form.formState.isSubmitSuccessful])

  useEffect(() => {
    if (allFields) {
      setIsActionFailure(false)
      return
    }

    setIsActionFailure(Object.keys(form.formState.errors).length > 0)
  }, [allFields, form.formState.errors])

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
    (!currentChallenge && areAllFieldsFilled) ||
    (Boolean(currentChallenge) && areAllFieldsFilled && form.formState.isDirty)

    const errorMessages = useMemo(() => {
      const messages: string[] = []

      if (form.formState.errors.description?.message) {
        messages.push(form.formState.errors.description?.message)
      }
      if (form.formState.errors.testCases?.message) {
        messages.push(form.formState.errors.testCases?.message)
      }
      if (form.formState.errors.title?.message) {
        messages.push(form.formState.errors.title?.message)
      }
      if (form.formState.errors.function?.message) {
        messages.push(form.formState.errors.function?.message)
      }
      if (form.formState.errors.categories?.message) {
        messages.push(form.formState.errors.categories?.message)
      }

      return messages
    }, [currentChallenge, allFields, form.formState.errors])

  return {
    form,
    canSubmitForm,
    shouldEditChallenge: currentChallenge,
    isFormSubmitting: form.formState.isSubmitting,
    isActionFailure: isActionFailure || errorMessages.length > 0,
    isActionSuccess,
    errorMessages,
    handleFormSubmit: form.handleSubmit(handleSubmit),
    handleBackButtonClick,
    handleDeleteChallengeButtonClick,
  }
}
