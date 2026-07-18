import { act, renderHook } from '@testing-library/react'

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
})
