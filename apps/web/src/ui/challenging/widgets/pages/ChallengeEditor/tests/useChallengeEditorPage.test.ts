import { act, renderHook } from '@testing-library/react'
import { useFieldArray } from 'react-hook-form'

import {
  ChallengeCategoriesFaker,
  ChallengesFaker,
} from '@stardust/core/challenging/entities/fakers'
import { Id } from '@stardust/core/global/structures'

import { useChallengeEditorPage } from '../useChallengeEditorPage'

jest.mock('@/ui/global/hooks/useLsp', () => ({
  useLsp: jest.fn(),
}))

const { useLsp } = require('@/ui/global/hooks/useLsp')

describe('useChallengeEditorPage', () => {
  const lspProvider = {
    getFunctionName: jest.fn(() => 'soma'),
    getFunctionParamsNames: jest.fn(() => ['a']),
  }

  const params = {
    userId: Id.create(),
    isEditingAsAdmin: false,
    service: {
      postChallenge: jest.fn(),
      updateChallenge: jest.fn(),
      deleteChallenge: jest.fn(),
    },
    navigationProvider: {
      goTo: jest.fn(),
      goBack: jest.fn(),
      refresh: jest.fn(),
      openExternal: jest.fn(),
      currentRoute: '/challenges/new',
    },
    toastProvider: {
      show: jest.fn(),
      showSuccess: jest.fn(),
      showError: jest.fn(),
    },
  } as any

  beforeEach(() => {
    jest.clearAllMocks()
    lspProvider.getFunctionName.mockReset().mockImplementation(() => 'soma')
    lspProvider.getFunctionParamsNames.mockReset().mockImplementation(() => ['a'])
    jest.mocked(useLsp).mockReturnValue({ lspProvider } as ReturnType<typeof useLsp>)
  })

  it('should hydrate existing challenge as output evaluated without requiring function fields', async () => {
    lspProvider.getFunctionName.mockReturnValueOnce(null as any)
    lspProvider.getFunctionParamsNames.mockReturnValueOnce([])
    const currentChallenge = ChallengesFaker.fake({
      initialCode: 'escreva(a)',
      isEvaluatedByFunction: false,
      categories: [ChallengeCategoriesFaker.fakeDto()],
    })

    const { result } = renderHook(() =>
      useChallengeEditorPage({
        ...params,
        currentChallenge,
      }),
    )

    expect(result.current.form.getValues('isEvaluatedByFunction')).toBe(false)
    expect(result.current.form.getValues('function')).toEqual({
      name: '',
      params: [],
    })
    await act(async () => {
      await result.current.form.trigger()
    })
    expect(result.current.form.formState.errors.function).toBeUndefined()
  })

  it('should not generate initial code when function metadata changes for output evaluated challenge', () => {
    const currentChallenge = ChallengesFaker.fake({
      initialCode: 'escreva(a)',
      isEvaluatedByFunction: false,
      categories: [ChallengeCategoriesFaker.fakeDto()],
    })

    const { result } = renderHook(() =>
      useChallengeEditorPage({
        ...params,
        currentChallenge,
      }),
    )

    act(() => {
      result.current.form.setValue('function', {
        name: 'dobro',
        params: [{ name: 'valor', dataTypeName: 'number' }],
      })
    })

    expect(result.current.form.getValues('initialCode')).toBe('escreva(a)')
  })

  it('protects only the first dirty navigation until it is confirmed', () => {
    const { result } = renderHook(() =>
      useChallengeEditorPage({
        ...params,
        currentChallenge: null,
      }),
    )
    const firstNavigation = jest.fn()
    const secondNavigation = jest.fn()

    act(() => {
      result.current.form.setValue('title', 'Desafio alterado', { shouldDirty: true })
    })
    expect(result.current.hasUnsavedChanges).toBe(true)

    act(() => {
      result.current.requestNavigation(firstNavigation)
      result.current.requestNavigation(secondNavigation)
    })

    expect(result.current.isNavigationDialogOpen).toBe(true)
    act(() => result.current.cancelNavigation())
    expect(firstNavigation).not.toHaveBeenCalled()
    expect(secondNavigation).not.toHaveBeenCalled()
    expect(result.current.hasUnsavedChanges).toBe(true)

    act(() => result.current.requestNavigation(firstNavigation))
    act(() => result.current.confirmNavigation())
    expect(firstNavigation).toHaveBeenCalledTimes(1)
  })

  it('marks the form dirty when a dynamic field-array item is created', () => {
    const { result } = renderHook(() => {
      const page = useChallengeEditorPage({
        ...params,
        currentChallenge: null,
      })
      const functionParams = useFieldArray({
        control: page.form.control,
        name: 'function.params',
      })

      return { page, appendParam: functionParams.append }
    })

    expect(result.current.page.hasUnsavedChanges).toBe(false)
    act(() => {
      result.current.appendParam({ name: 'valor', dataTypeName: 'number' } as any)
    })

    expect(result.current.page.form.getValues('function.params')).toHaveLength(1)
    expect(result.current.page.hasUnsavedChanges).toBe(true)
    act(() => result.current.page.cancelNavigation())
    act(() => result.current.page.requestNavigation(jest.fn()))
    expect(result.current.page.isNavigationDialogOpen).toBe(true)
  })

  it('leaves clean forms unprotected and reset forms clean', () => {
    const { result } = renderHook(() =>
      useChallengeEditorPage({ ...params, currentChallenge: null }),
    )
    expect(result.current.hasUnsavedChanges).toBe(false)
    act(() => result.current.handleBackButtonClick())
    expect(params.navigationProvider.goBack).toHaveBeenCalledTimes(1)
    expect(result.current.isNavigationDialogOpen).toBe(false)

    act(() => {
      result.current.form.setValue('title', 'rascunho', { shouldDirty: true })
      result.current.form.reset(result.current.form.getValues())
    })

    expect(result.current.hasUnsavedChanges).toBe(false)
    act(() => result.current.handleBackButtonClick())
    expect(params.navigationProvider.goBack).toHaveBeenCalledTimes(2)
    expect(result.current.isNavigationDialogOpen).toBe(false)
  })

  it('cancels a pending navigation without losing the dirty state', () => {
    const { result } = renderHook(() =>
      useChallengeEditorPage({ ...params, currentChallenge: null }),
    )
    const navigation = jest.fn()

    act(() => {
      result.current.form.setValue('title', 'rascunho', { shouldDirty: true })
    })
    act(() => {
      result.current.requestNavigation(navigation)
      result.current.cancelNavigation()
    })

    expect(navigation).not.toHaveBeenCalled()
    expect(result.current.hasUnsavedChanges).toBe(true)
    expect(result.current.isNavigationDialogOpen).toBe(false)
  })

  it('consumes a confirmed navigation exactly once', () => {
    const { result } = renderHook(() =>
      useChallengeEditorPage({ ...params, currentChallenge: null }),
    )
    const navigation = jest.fn()

    act(() => {
      result.current.form.setValue('title', 'rascunho', { shouldDirty: true })
      result.current.requestNavigation(navigation)
      result.current.confirmNavigation()
      result.current.confirmNavigation()
    })

    expect(navigation).toHaveBeenCalledTimes(1)
    expect(result.current.isNavigationDialogOpen).toBe(false)
  })

  it('resets the form after a successful update', async () => {
    jest.useFakeTimers()
    params.service.updateChallenge.mockResolvedValue({
      isFailure: false,
      isSuccessful: true,
    })
    const currentChallenge = ChallengesFaker.fake({
      categories: [ChallengeCategoriesFaker.fakeDto()],
    })
    const { result } = renderHook(() =>
      useChallengeEditorPage({ ...params, currentChallenge }),
    )

    act(() => {
      result.current.form.setValue('title', 'titulo atualizado', { shouldDirty: true })
      result.current.form.setValue('description', 'descricao valida')
      result.current.form.setValue('initialCode', 'funcao soma(a) {}')
      result.current.form.setValue('function.name', 'soma')
    })
    await act(async () => {
      await result.current.handleFormSubmit({
        preventDefault: jest.fn(),
        persist: jest.fn(),
      } as any)
    })

    expect(params.service.updateChallenge).toHaveBeenCalled()
    expect(result.current.hasUnsavedChanges).toBe(false)
    expect(result.current.isActionSuccess).toBe(true)
    act(() => jest.runOnlyPendingTimers())
    expect(params.navigationProvider.goTo).toHaveBeenCalledTimes(1)
    jest.useRealTimers()
  })

  it('resets a newly created form before scheduling the redirect', async () => {
    jest.useFakeTimers()
    params.service.postChallenge.mockResolvedValue({
      isFailure: false,
      isSuccessful: true,
      body: { slug: 'novo-desafio' },
    })
    const currentChallenge = ChallengesFaker.fake({
      categories: [ChallengeCategoriesFaker.fakeDto()],
    })
    const { result } = renderHook(() =>
      useChallengeEditorPage({ ...params, currentChallenge: null }),
    )

    act(() => {
      result.current.form.reset({
        title: 'Titulo novo',
        description: 'Descricao valida',
        initialCode: 'funcao soma(a) {}',
        difficultyLevel: 'easy',
        author: { id: params.userId.value },
        function: { name: 'soma', params: [{ name: 'a', dataTypeName: 'number' }] },
        testCases: [
          {
            inputs: [],
            expectedOutput: { dataTypeName: 'number', value: 1 },
            isLocked: false,
          },
          {
            inputs: [],
            expectedOutput: { dataTypeName: 'number', value: 2 },
            isLocked: false,
          },
          {
            inputs: [],
            expectedOutput: { dataTypeName: 'number', value: 3 },
            isLocked: false,
          },
        ],
        categories: [currentChallenge.categories[0].dto],
        isEvaluatedByFunction: true,
        isPublic: false,
      } as any)
      result.current.form.setValue('title', 'novo titulo', { shouldDirty: true })
    })

    await act(async () => {
      await result.current.handleFormSubmit({
        preventDefault: jest.fn(),
        persist: jest.fn(),
      } as any)
    })

    expect(params.service.postChallenge).toHaveBeenCalledTimes(1)
    expect(result.current.hasUnsavedChanges).toBe(false)
    expect(params.navigationProvider.goTo).not.toHaveBeenCalled()
    act(() => jest.runOnlyPendingTimers())
    expect(params.navigationProvider.goTo).toHaveBeenCalledWith(
      expect.stringContaining('novo-desafio'),
    )
    jest.useRealTimers()
  })

  it('preserves dirty values when an update fails', async () => {
    params.service.updateChallenge.mockResolvedValue({
      isFailure: true,
      isSuccessful: false,
      errorMessage: 'falha',
    })
    const currentChallenge = ChallengesFaker.fake({
      categories: [ChallengeCategoriesFaker.fakeDto()],
    })
    const { result } = renderHook(() =>
      useChallengeEditorPage({ ...params, currentChallenge }),
    )
    act(() => {
      result.current.form.setValue('title', 'titulo com falha', { shouldDirty: true })
      result.current.form.setValue('description', 'descricao valida')
      result.current.form.setValue('initialCode', 'funcao soma(a) {}')
      result.current.form.setValue('function.name', 'soma')
    })

    await act(async () => {
      await result.current.handleFormSubmit({
        preventDefault: jest.fn(),
        persist: jest.fn(),
      } as any)
    })

    expect(result.current.form.getValues('title')).toBe('titulo com falha')
    expect(result.current.hasUnsavedChanges).toBe(true)
    act(() => result.current.requestNavigation(jest.fn()))
    expect(result.current.isNavigationDialogOpen).toBe(true)
  })

  it('resets protection before navigating after a successful deletion', async () => {
    params.service.deleteChallenge.mockResolvedValue({
      isFailure: false,
      isSuccessful: true,
    })
    const currentChallenge = ChallengesFaker.fake({
      categories: [ChallengeCategoriesFaker.fakeDto()],
    })
    const { result } = renderHook(() =>
      useChallengeEditorPage({ ...params, currentChallenge }),
    )
    act(() => result.current.form.setValue('title', 'titulo', { shouldDirty: true }))

    await act(async () => {
      await result.current.handleDeleteChallengeButtonClick()
    })

    expect(result.current.hasUnsavedChanges).toBe(false)
    expect(params.navigationProvider.goTo).toHaveBeenCalledWith(
      expect.stringContaining('/challenges'),
    )
  })

  it('keeps protection active after a failed deletion', async () => {
    params.service.deleteChallenge.mockResolvedValue({
      isFailure: true,
      isSuccessful: false,
      errorMessage: 'falha',
    })
    const currentChallenge = ChallengesFaker.fake({
      categories: [ChallengeCategoriesFaker.fakeDto()],
    })
    const { result } = renderHook(() =>
      useChallengeEditorPage({ ...params, currentChallenge }),
    )
    act(() => result.current.form.setValue('title', 'titulo', { shouldDirty: true }))

    await act(async () => {
      await result.current.handleDeleteChallengeButtonClick()
    })

    expect(result.current.hasUnsavedChanges).toBe(true)
    expect(params.navigationProvider.goTo).not.toHaveBeenCalled()
  })
})
