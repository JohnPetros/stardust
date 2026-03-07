import { act, renderHook } from '@testing-library/react'

import { List } from '@stardust/core/global/structures'
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

  const lspProvider = {
    run: jest.fn(),
    addInputs: jest.fn(),
    addFunctionCall: jest.fn(),
    buildFunction: jest.fn(),
    getFunctionName: jest.fn(() => null),
    getFunctionParamsNames: jest.fn(() => []),
    getInput: jest.fn(() => null),
    translateToLsp: jest.fn(async (value) => String(value ?? '')),
    translateToJs: jest.fn(),
    getInputsCount: jest.fn(() => 0),
    performSyntaxAnalysis: jest.fn(),
    performSemanticAnalysis: jest.fn(),
  }

  const challenge = {
    id: { value: 'challenge-id' },
    slug: { value: 'challenge-slug' },
    code: 'escreva("oi")',
    results: List.create<boolean>([true]),
    runCode: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()

    jest.mocked(useChallengeStore).mockReturnValue({
      getChallengeSlice: () => ({ challenge }),
      getPanelsLayoutSlice: () => ({ panelsLayout: null }),
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
      currentRoute: '',
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
    expect(goTo).toHaveBeenCalledWith(
      ROUTES.challenging.challenges.challengeResult(challenge.slug.value),
    )
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

  it('should show the corrected interpreter error message on unexpected failures', async () => {
    challenge.runCode.mockRejectedValue(new Error('unexpected'))

    const { result } = renderHook(() => useChallengeCodeEditorSlot())

    await act(async () => {
      await result.current.handleRunCode()
    })

    expect(playAudio).toHaveBeenCalledWith('fail-code-result.wav')
    expect(showError).toHaveBeenCalledWith('Erro interno do interpretador!')
  })
})
