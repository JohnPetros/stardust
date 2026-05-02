import { act, renderHook, waitFor } from '@testing-library/react'
import type { RefObject } from 'react'
import { type Mock, mock } from 'ts-jest-mocker'

import type { LspSnippet } from '@stardust/core/global/types'
import type { SnippetDto } from '@stardust/core/playground/entities/dtos'
import type { PlaygroundService } from '@stardust/core/playground/interfaces'

import { useToastContextMock } from '@/ui/global/contexts/ToastContext/tests/mocks'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { useWindowSize } from '@/ui/global/hooks/useWindowSize'
import { useRefMock } from '@/ui/global/hooks/tests/mocks/useRefMock'
import { useRouterMock } from '@/ui/global/hooks/tests/mocks/useRouterMock'
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import type { PlaygroundCodeEditorRef } from '@/ui/global/widgets/components/PlaygroundCodeEditor/types'
import { useSnippetPage } from '../useSnippetPage'

jest.mock('@/ui/global/contexts/ToastContext')
jest.mock('@/ui/global/hooks/useNavigationProvider')
jest.mock('@/ui/global/hooks/useWindowSize', () => ({
  useWindowSize: jest.fn(),
}))

type Params = Parameters<typeof useSnippetPage>[0]

describe('useSnippetPage', () => {
  let playgroundService: Mock<PlaygroundService>
  let playgroudCodeEditorRef: { current: PlaygroundCodeEditorRef | null }
  let authAlertDialogRef: RefObject<AlertDialogRef | null>
  let replaceSnippetAlertDialogRef: RefObject<AlertDialogRef | null>

  const firstExampleSnippet: LspSnippet = {
    label: 'Ola mundo',
    code: 'escreva("Ola mundo")',
  }

  const secondExampleSnippet: LspSnippet = {
    label: 'Variaveis e tipos',
    code: 'var nome = "StarDust"',
  }

  const snippetDto: SnippetDto = {
    id: 'f45cb2e1-87e3-4622-b3b8-012e8ee0dfc4',
    title: 'Snippet atual',
    code: 'escreva("Atual")',
    isPublic: true,
    createdAt: new Date('2026-04-29T00:00:00.000Z'),
    author: {
      id: '6e2816b1-a67a-4d1a-a785-d33286a344db',
    },
  }

  const Hook = (params?: Partial<Params>) =>
    renderHook(() =>
      useSnippetPage({
        playgroundService,
        playgroudCodeEditorRef,
        authAlertDialogRef,
        replaceSnippetAlertDialogRef,
        ...params,
      }),
    )

  function getFormValues(result: { current: ReturnType<typeof useSnippetPage> }) {
    return (result.current.formControl as any)._formValues as {
      snippetTitle: string
      snippetCode: string
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()

    useToastContextMock()
    useRouterMock()
    jest.mocked(useNavigationProvider).mockReturnValue({
      goTo: jest.fn(),
      goBack: jest.fn(),
      refresh: jest.fn(),
      openExternal: jest.fn(),
      currentRoute: '/playground/snippets/new',
    })
    jest.mocked(useWindowSize).mockReturnValue({
      width: 1280,
      height: 720,
    })

    playgroundService = mock<PlaygroundService>()
    playgroudCodeEditorRef = {
      current: {
        getValue: jest.fn(() => ''),
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
    authAlertDialogRef = useRefMock<AlertDialogRef>({
      open: jest.fn(),
      close: jest.fn(),
    }) as RefObject<AlertDialogRef | null>
    replaceSnippetAlertDialogRef = useRefMock<AlertDialogRef>({
      open: jest.fn(),
      close: jest.fn(),
    }) as RefObject<AlertDialogRef | null>
  })

  it('should apply an example snippet immediately when title and code are not dirty', async () => {
    const { result } = Hook()

    act(() => {
      result.current.handleExampleSnippetSelect(firstExampleSnippet)
    })

    await waitFor(() => {
      expect(getFormValues(result).snippetTitle).toBe(firstExampleSnippet.label)
      expect(getFormValues(result).snippetCode).toBe(firstExampleSnippet.code)
      expect(result.current.canExecuteAction).toBe(true)
    })

    expect(playgroudCodeEditorRef.current?.setValue).toHaveBeenCalledWith(
      firstExampleSnippet.code,
    )
    expect(playgroundService.createSnippet).not.toHaveBeenCalled()
    expect(playgroundService.updateSnippet).not.toHaveBeenCalled()
  })

  it('should keep the current content and open the replace dialog when an example is selected after local changes', async () => {
    const { result } = Hook()

    act(() => {
      result.current.handleExampleSnippetSelect(firstExampleSnippet)
    })

    await waitFor(() => {
      expect(result.current.canExecuteAction).toBe(true)
    })

    ;(playgroudCodeEditorRef.current?.setValue as jest.Mock).mockClear()
    ;(replaceSnippetAlertDialogRef.current?.open as jest.Mock).mockClear()

    act(() => {
      result.current.handleExampleSnippetSelect(secondExampleSnippet)
    })

    expect(replaceSnippetAlertDialogRef.current?.open).toHaveBeenCalledTimes(1)
    expect(playgroudCodeEditorRef.current?.setValue).not.toHaveBeenCalled()
    expect(getFormValues(result).snippetTitle).toBe(firstExampleSnippet.label)
    expect(getFormValues(result).snippetCode).toBe(firstExampleSnippet.code)
    expect(playgroundService.createSnippet).not.toHaveBeenCalled()
    expect(playgroundService.updateSnippet).not.toHaveBeenCalled()
  })

  it('should replace the current content with the pending example when replacement is confirmed without persisting', async () => {
    const { result } = Hook({
      snippetDto,
    })

    act(() => {
      result.current.handleExampleSnippetSelect(firstExampleSnippet)
    })

    await waitFor(() => {
      expect(result.current.canExecuteAction).toBe(true)
    })

    ;(playgroudCodeEditorRef.current?.setValue as jest.Mock).mockClear()

    act(() => {
      result.current.handleExampleSnippetSelect(secondExampleSnippet)
    })

    act(() => {
      result.current.handleExampleSnippetReplaceConfirm()
    })

    await waitFor(() => {
      expect(getFormValues(result).snippetTitle).toBe(secondExampleSnippet.label)
      expect(getFormValues(result).snippetCode).toBe(secondExampleSnippet.code)
    })

    expect(playgroudCodeEditorRef.current?.setValue).toHaveBeenCalledWith(
      secondExampleSnippet.code,
    )
    expect(playgroundService.createSnippet).not.toHaveBeenCalled()
    expect(playgroundService.updateSnippet).not.toHaveBeenCalled()
  })
})
