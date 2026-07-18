import { act, renderHook } from '@testing-library/react'

import { List } from '@stardust/core/global/structures'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { RestResponse } from '@stardust/core/global/responses'
import { LspError } from '@stardust/core/global/errors'

import { ROUTES } from '@/constants'

jest.mock('@/ui/challenging/stores/ChallengeStore', () => ({
  useChallengeStore: jest.fn(),
}))
jest.mock('@/ui/global/contexts/ToastContext', () => ({
  useToastContext: jest.fn(),
}))
jest.mock('@/ui/global/hooks/useBreakpoint', () => ({
  useBreakpoint: jest.fn(),
}))
jest.mock('@/ui/global/hooks/useLsp', () => ({
  useLsp: jest.fn(),
}))
jest.mock('@/ui/global/hooks/useLocalStorage', () => ({
  useLocalStorage: jest.fn(),
}))
jest.mock('@/ui/global/hooks/useNavigationProvider', () => ({
  useNavigationProvider: jest.fn(),
}))
jest.mock('@/ui/global/hooks/useAudioContext', () => ({
  useAudioContext: jest.fn(),
}))

const { useChallengeCodeEditorSlot } = require('../useChallengeCodeEditorSlot')
const { useChallengeStore } = require('@/ui/challenging/stores/ChallengeStore')
const { useToastContext } = require('@/ui/global/contexts/ToastContext')
const { useBreakpoint } = require('@/ui/global/hooks/useBreakpoint')
const { useLsp } = require('@/ui/global/hooks/useLsp')
const { useLocalStorage } = require('@/ui/global/hooks/useLocalStorage')
const { useNavigationProvider } = require('@/ui/global/hooks/useNavigationProvider')
const { useAudioContext } = require('@/ui/global/hooks/useAudioContext')

describe('useChallengeCodeEditorSlot', () => {
  const setResults = jest.fn()
  const setActiveContent = jest.fn()
  const showResultTab = jest.fn()
  const goTo = jest.fn()
  const show = jest.fn()
  const showError = jest.fn()
  const playAudio = jest.fn()
  const localStorageGet = jest.fn()
  const localStorageSet = jest.fn()
  const pushState = jest.fn()
  let currentRoute = '/challenge'

  const lspProvider = {
    run: jest.fn(),
    addInputs: jest.fn(),
    addFunctionCall: jest.fn(),
    buildFunction: jest.fn(),
    getFunctionName: jest.fn(() => null),
    getFunctionParamsNames: jest.fn(() => []),
    getInput: jest.fn(() => null),
    getCompletions: jest.fn(() => []),
    translateToLsp: jest.fn(async (value) => String(value ?? '')),
    translateToJs: jest.fn(),
    getInputsCount: jest.fn(() => 0),
    performSyntaxAnalysis: jest.fn(),
    performSemanticAnalysis: jest.fn(),
  }

  const challenge = {
    id: { value: 'challenge-id' },
    slug: { value: 'challenge-slug' },
    initialCode: { value: 'escreva("oi")' },
    isEvaluatedByFunction: { isFalse: true },
    results: List.create<boolean>([true]),
    runCode: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(window.history, 'pushState').mockImplementation(pushState)
    currentRoute = '/challenge'

    jest.mocked(useChallengeStore).mockReturnValue({
      getChallengeSlice: () => ({ challenge }),
      getPanelOrderSlice: () => ({ panelOrder: ['tabs', 'code_editor', 'assistant'] }),
      getPanelsOffsetSlice: () => ({
        panelsOffset: {
          tabsPanelSize: 38,
          codeEditorPanelSize: 38,
          assistantPanelSize: 24,
        },
      }),
      getResultsSlice: () => ({ setResults }),
      getTabHandlerSlice: () => ({
        tabHandler: {
          showResultTab,
          showCodeTab: jest.fn(),
          showAssistantTab: jest.fn(),
        },
      }),
      getActiveContentSlice: () => ({ setActiveContent }),
    } as unknown as ReturnType<typeof useChallengeStore>)

    jest.mocked(useToastContext).mockReturnValue({
      show,
      showSuccess: jest.fn(),
      showError,
    } as ReturnType<typeof useToastContext>)

    jest.mocked(useBreakpoint).mockReturnValue({
      xs: false,
      sm: false,
      md: true,
      lg: false,
      xl: false,
    })

    jest.mocked(useLsp).mockReturnValue({ lspProvider } as ReturnType<typeof useLsp>)

    jest.mocked(useLocalStorage).mockReturnValue({
      get: localStorageGet,
      set: localStorageSet,
      remove: jest.fn(),
    } as ReturnType<typeof useLocalStorage>)

    jest.mocked(useNavigationProvider).mockReturnValue({
      goTo,
      goBack: jest.fn(),
      refresh: jest.fn(),
      openExternal: jest.fn(),
      currentRoute,
    } as ReturnType<typeof useNavigationProvider>)

    jest.mocked(useAudioContext).mockReturnValue({
      playAudio,
      stopAudio: jest.fn(),
      speaker: null,
      isSpeakerEnabled: true,
      setIsSpeakerEnabled: jest.fn(),
      speakerRate: 1,
      setSpeakerRate: jest.fn(),
      speakerVolume: 1,
      setSpeakerVolume: jest.fn(),
    } as ReturnType<typeof useAudioContext>)

    localStorageGet.mockReturnValue(null)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should open console and redirect when execution succeeds with outputs', async () => {
    challenge.runCode.mockResolvedValue(List.create(['linha 1', 'linha 2']))

    const { result } = renderHook(() => useChallengeCodeEditorSlot())
    const open = jest.fn()
    const close = jest.fn()

    act(() => {
      result.current.consoleRef.current = { open, close }
    })

    await act(async () => {
      await result.current.handleRunCode()
    })

    expect(close).toHaveBeenCalledTimes(1)
    expect(open).toHaveBeenCalledTimes(1)
    expect(result.current.outputs).toStrictEqual(['linha 1', 'linha 2'])
    expect(setResults).toHaveBeenCalledWith([true])
    expect(setActiveContent).toHaveBeenCalledWith('result')
    expect(showResultTab).toHaveBeenCalledTimes(1)
    expect(pushState).toHaveBeenCalledWith(
      null,
      '',
      ROUTES.challenging.challenges.challengeResult(challenge.slug.value),
    )
    expect(goTo).not.toHaveBeenCalled()
  })

  it('should execute code locally and update results when unauthenticated', async () => {
    const challengingService = {
      runChallengeCode: jest.fn(),
    }
    challenge.runCode.mockResolvedValue(List.create([]))

    const { result } = renderHook(() =>
      useChallengeCodeEditorSlot({
        challengingService,
        isAccountAuthenticated: false,
      }),
    )

    await act(async () => {
      await result.current.handleRunCode()
    })

    expect(challengingService.runChallengeCode).not.toHaveBeenCalled()
    expect(challenge.runCode).toHaveBeenCalledTimes(1)
    expect(setResults).toHaveBeenCalledWith([true])
    expect(setActiveContent).toHaveBeenCalledWith('result')
  })

  it('should invalidate the session and execute locally when the API is unauthorized', async () => {
    const onUnauthorized = jest.fn()
    const challengingService = {
      runChallengeCode: jest.fn().mockResolvedValue(
        new RestResponse({
          errorMessage: 'Conta não autorizada',
          statusCode: HTTP_STATUS_CODE.unauthorized,
        }),
      ),
    }
    challenge.runCode.mockResolvedValue(List.create([]))

    const { result } = renderHook(() =>
      useChallengeCodeEditorSlot({
        challengingService,
        isAccountAuthenticated: true,
        onUnauthorized,
      }),
    )

    await act(async () => {
      await result.current.handleRunCode()
    })

    expect(onUnauthorized).toHaveBeenCalledTimes(1)
    expect(challenge.runCode).toHaveBeenCalledTimes(1)
    expect(setResults).toHaveBeenCalledWith([true])
    expect(setActiveContent).toHaveBeenCalledWith('result')
    expect(showError).not.toHaveBeenCalled()
    expect(playAudio).not.toHaveBeenCalled()
  })

  it('should activate result content on desktop when execution succeeds', async () => {
    jest.mocked(useBreakpoint).mockReturnValue({
      xs: false,
      sm: false,
      md: false,
      lg: true,
      xl: true,
    })
    challenge.runCode.mockResolvedValue(List.create([]))

    const { result } = renderHook(() => useChallengeCodeEditorSlot())

    await act(async () => {
      await result.current.handleRunCode()
    })

    expect(setResults).toHaveBeenCalledWith([true])
    expect(setActiveContent).toHaveBeenCalledWith('result')
    expect(showResultTab).not.toHaveBeenCalled()
    expect(pushState).toHaveBeenCalledWith(
      null,
      '',
      ROUTES.challenging.challenges.challengeResult(challenge.slug.value),
    )
    expect(goTo).not.toHaveBeenCalled()
  })

  it('should not push a new history entry when already on the result route', async () => {
    currentRoute = ROUTES.challenging.challenges.challengeResult(challenge.slug.value)
    jest.mocked(useNavigationProvider).mockReturnValue({
      goTo,
      goBack: jest.fn(),
      refresh: jest.fn(),
      openExternal: jest.fn(),
      currentRoute,
    } as ReturnType<typeof useNavigationProvider>)
    challenge.runCode.mockResolvedValue(List.create([]))

    const { result } = renderHook(() => useChallengeCodeEditorSlot())

    await act(async () => {
      await result.current.handleRunCode()
    })

    expect(setActiveContent).toHaveBeenCalledWith('result')
    expect(pushState).not.toHaveBeenCalled()
    expect(goTo).not.toHaveBeenCalled()
  })

  it('should not open console when execution fails', async () => {
    challenge.runCode.mockRejectedValue(new LspError('Código inválido', 3))

    const { result } = renderHook(() => useChallengeCodeEditorSlot())
    const open = jest.fn()
    const close = jest.fn()

    act(() => {
      result.current.consoleRef.current = { open, close }
    })

    await act(async () => {
      await result.current.handleRunCode()
    })

    expect(close).toHaveBeenCalledTimes(1)
    expect(open).not.toHaveBeenCalled()
    expect(playAudio).toHaveBeenCalledWith('fail-code-result.wav')
    expect(show).toHaveBeenCalledWith('Código inválido </br>Linha: 3', {
      type: 'error',
      seconds: 5,
    })
    expect(goTo).not.toHaveBeenCalled()
  })

  it('should open console manually even without outputs', () => {
    const { result } = renderHook(() => useChallengeCodeEditorSlot())
    const open = jest.fn()

    act(() => {
      result.current.consoleRef.current = { open, close: jest.fn() }
      result.current.handleOpenConsole()
    })

    expect(open).toHaveBeenCalledTimes(1)
  })

  it('should show execution error message as a toast', async () => {
    const challengingService = {
      runChallengeCode: jest.fn().mockResolvedValue({
        isFailure: false,
        body: {
          code: 'codigo invalido',
          status: 'runtime_error',
          testResults: [],
          outputs: [],
          error: {
            message: 'Variável não definida',
            line: 2,
            isInternal: false,
          },
          createdAt: '2026-07-17T12:00:00.000Z',
        },
      }),
    }

    const { result } = renderHook(() =>
      useChallengeCodeEditorSlot({
        challengingService,
        isAccountAuthenticated: true,
      }),
    )

    await act(async () => {
      await result.current.handleRunCode()
    })

    expect(showError).toHaveBeenCalledWith('Variável não definida', 5)
  })

  it('should ignore an execution response after the code changes', async () => {
    let resolveExecution: (response: unknown) => void = () => {}
    const challengingService = {
      runChallengeCode: jest.fn().mockReturnValue(
        new Promise((resolve) => {
          resolveExecution = resolve
        }),
      ),
    }
    const { result } = renderHook(() =>
      useChallengeCodeEditorSlot({
        challengingService,
        isAccountAuthenticated: true,
      }),
    )

    let executionPromise: Promise<void>
    act(() => {
      executionPromise = result.current.handleRunCode()
    })

    act(() => {
      result.current.handleCodeChange('codigo atualizado')
    })

    resolveExecution({
      isFailure: false,
      body: {
        code: 'escreva("oi")',
        status: 'runtime_error',
        testResults: [],
        outputs: [],
        error: {
          message: 'Erro do código antigo',
          line: 1,
          isInternal: false,
        },
        createdAt: '2026-07-17T12:00:00.000Z',
      },
    })

    await act(async () => {
      await executionPromise
    })

    expect(showError).not.toHaveBeenCalled()
    expect(setActiveContent).not.toHaveBeenCalled()
    expect(result.current.outputs).toEqual([])
  })

  it('should show the corrected interpreter error message on unexpected failures', async () => {
    challenge.runCode.mockRejectedValue(new Error('unexpected'))

    const { result } = renderHook(() => useChallengeCodeEditorSlot())

    await act(async () => {
      await result.current.handleRunCode()
    })

    expect(playAudio).toHaveBeenCalledWith('fail-code-result.wav')
    expect(showError).toHaveBeenCalledWith('Erro interno do interpretador.')
  })
})
