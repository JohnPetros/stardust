import { act, renderHook, waitFor } from '@testing-library/react'
import { type Mock, mock } from 'ts-jest-mocker'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { RestResponse } from '@stardust/core/global/responses'
import type { LessonService } from '@stardust/core/lesson/interfaces'

import { STORAGE } from '@/constants/storage'

import { useCodeSnippet } from '../useCodeSnippet'
import type { LessonCodeExplanation } from '../index'
import type { PlaygroundCodeEditorRef } from '../../PlaygroundCodeEditor/types'

jest.mock('@/ui/global/hooks/useClipboard', () => ({
  useClipboard: () => ({
    copy: jest.fn(),
  }),
}))

type ResponseProps<T> = {
  body?: T
  statusCode?: number
  errorMessage?: string
}

function createResponse<T>(props: ResponseProps<T>) {
  return new RestResponse<T>(props)
}

describe('useCodeSnippet', () => {
  let lessonService: Mock<LessonService>
  let codeEditorRef: { current: PlaygroundCodeEditorRef | null }

  const storyStorageKey = STORAGE.keys.lessonCodeExplanation(4)

  const Hook = (params?: {
    lessonCodeExplanation?: LessonCodeExplanation
    code?: string
  }) =>
    renderHook(() =>
      useCodeSnippet({
        code: params?.code ?? 'escreva("oi")',
        codeEditorRef,
        lessonService,
        lessonCodeExplanation: params?.lessonCodeExplanation,
      }),
    )

  beforeEach(() => {
    jest.clearAllMocks()
    window.localStorage.clear()

    lessonService = mock<LessonService>()
    codeEditorRef = {
      current: {
        getValue: jest.fn(() => 'escreva("oi")'),
        setValue: jest.fn(),
        reloadValue: jest.fn(),
        undoValue: jest.fn(),
        getCursorPosition: jest.fn(() => null),
        setCursorPosition: jest.fn(),
        getSelectedLinesRange: jest.fn(() => null),
        getSelectedText: jest.fn(() => null),
        runCode: jest.fn(),
      },
    }

    lessonService.fetchRemainingCodeExplanationUses.mockResolvedValue(
      createResponse({ body: { remainingUses: 3 }, statusCode: 200 }),
    )
    lessonService.explainCode.mockResolvedValue(
      createResponse({ body: { explanation: 'Explicacao gerada' }, statusCode: 200 }),
    )
  })

  it('should open the explanation dialog from story cache hit without calling the service', async () => {
    window.localStorage.setItem(storyStorageKey, JSON.stringify('Explicacao em cache'))

    const { result } = Hook({ lessonCodeExplanation: { source: 'story', chunkIndex: 4 } })

    await act(async () => {
      await result.current.handleCodeExplanationButtonClick()
    })

    expect(result.current.explanation).toBe('Explicacao em cache')
    expect(result.current.isCodeExplanationDialogOpen).toBe(true)
    expect(lessonService.fetchRemainingCodeExplanationUses).not.toHaveBeenCalled()
    expect(lessonService.explainCode).not.toHaveBeenCalled()
  })

  it('should fetch remaining uses on story cache miss and open the blocked alert when the limit is exhausted', async () => {
    lessonService.fetchRemainingCodeExplanationUses.mockResolvedValueOnce(
      createResponse({ body: { remainingUses: 0 }, statusCode: 200 }),
    )

    const { result } = Hook({ lessonCodeExplanation: { source: 'story', chunkIndex: 4 } })

    await act(async () => {
      await result.current.handleCodeExplanationButtonClick()
    })

    expect(lessonService.fetchRemainingCodeExplanationUses).toHaveBeenCalledTimes(1)
    expect(result.current.remainingUses).toBe(0)
    expect(result.current.isCodeExplanationAlertDialogOpen).toBe(true)
    expect(result.current.codeExplanationAlertDialogMode).toBe('blocked')
  })

  it('should fetch remaining uses on story cache miss and open the confirm alert when there are uses left', async () => {
    lessonService.fetchRemainingCodeExplanationUses.mockResolvedValueOnce(
      createResponse({ body: { remainingUses: 2 }, statusCode: 200 }),
    )

    const { result } = Hook({ lessonCodeExplanation: { source: 'story', chunkIndex: 4 } })

    await act(async () => {
      await result.current.handleCodeExplanationButtonClick()
    })

    expect(lessonService.fetchRemainingCodeExplanationUses).toHaveBeenCalledTimes(1)
    expect(result.current.remainingUses).toBe(2)
    expect(result.current.isCodeExplanationAlertDialogOpen).toBe(true)
    expect(result.current.codeExplanationAlertDialogMode).toBe('confirm')
  })

  it('should persist the generated explanation only for story and decrement local remaining uses', async () => {
    lessonService.fetchRemainingCodeExplanationUses.mockResolvedValueOnce(
      createResponse({ body: { remainingUses: 3 }, statusCode: 200 }),
    )
    lessonService.explainCode.mockResolvedValueOnce(
      createResponse({ body: { explanation: 'Nova explicacao' }, statusCode: 200 }),
    )

    const { result } = Hook({ lessonCodeExplanation: { source: 'story', chunkIndex: 4 } })

    await act(async () => {
      await result.current.handleCodeExplanationButtonClick()
    })

    await act(async () => {
      await result.current.handleConfirmCodeExplanationAlertDialog()
    })

    expect(lessonService.explainCode).toHaveBeenCalledWith('escreva("oi")')
    expect(result.current.explanation).toBe('Nova explicacao')
    expect(result.current.remainingUses).toBe(2)
    expect(result.current.isCodeExplanationDialogOpen).toBe(true)
    expect(window.localStorage.getItem(storyStorageKey)).toBe(
      JSON.stringify('Nova explicacao'),
    )

    const quizHook = Hook({ lessonCodeExplanation: { source: 'quiz' } })

    await act(async () => {
      await quizHook.result.current.handleCodeExplanationButtonClick()
    })

    await act(async () => {
      await quizHook.result.current.handleConfirmCodeExplanationAlertDialog()
    })

    expect(window.localStorage.length).toBe(1)
  })

  it('should clear the cached story explanation before rechecking remaining uses on retry', async () => {
    window.localStorage.setItem(storyStorageKey, JSON.stringify('Explicacao em cache'))
    lessonService.fetchRemainingCodeExplanationUses.mockResolvedValueOnce(
      createResponse({ body: { remainingUses: 1 }, statusCode: 200 }),
    )

    const { result } = Hook({ lessonCodeExplanation: { source: 'story', chunkIndex: 4 } })

    await act(async () => {
      await result.current.handleCodeExplanationButtonClick()
    })

    expect(result.current.explanation).toBe('Explicacao em cache')

    await act(async () => {
      await result.current.handleCodeExplanationRetry()
    })

    expect(window.localStorage.getItem(storyStorageKey)).toBeNull()
    expect(result.current.explanation).toBe('')
    expect(lessonService.fetchRemainingCodeExplanationUses).toHaveBeenCalledTimes(1)
    expect(result.current.remainingUses).toBe(1)
    expect(result.current.isCodeExplanationAlertDialogOpen).toBe(true)
    expect(result.current.codeExplanationAlertDialogMode).toBe('confirm')
  })

  it('should close the explanation dialog and open the blocked alert when explain returns 403', async () => {
    lessonService.fetchRemainingCodeExplanationUses.mockResolvedValueOnce(
      createResponse({ body: { remainingUses: 1 }, statusCode: 200 }),
    )
    lessonService.explainCode.mockResolvedValueOnce(
      createResponse({
        statusCode: HTTP_STATUS_CODE.forbidden,
        errorMessage: 'Limite diario esgotado',
      }),
    )

    const { result } = Hook({ lessonCodeExplanation: { source: 'story', chunkIndex: 4 } })

    await act(async () => {
      await result.current.handleCodeExplanationButtonClick()
    })

    await act(async () => {
      await result.current.handleConfirmCodeExplanationAlertDialog()
    })

    await waitFor(() => {
      expect(result.current.isCodeExplanationDialogOpen).toBe(false)
    })

    expect(result.current.isCodeExplanationAlertDialogOpen).toBe(true)
    expect(result.current.codeExplanationAlertDialogMode).toBe('blocked')
    expect(result.current.remainingUses).toBe(0)
    expect(window.localStorage.getItem(storyStorageKey)).toBeNull()
  })
})
