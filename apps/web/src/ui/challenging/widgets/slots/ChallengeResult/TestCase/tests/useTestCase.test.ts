import { act, renderHook, waitFor } from '@testing-library/react'
import { type Mock, mock } from 'ts-jest-mocker'

import type { LspProvider } from '@stardust/core/global/interfaces'

import { useTestCase } from '../useTestCase'

describe('useTestCase', () => {
  let lspProvider: Mock<LspProvider>

  type Params = Parameters<typeof useTestCase>[0]

  const Hook = (params?: Partial<Params>) =>
    renderHook(() =>
      useTestCase({
        isLocked: false,
        isCorrect: false,
        inputs: [],
        userOutput: undefined,
        expectedOutput: 'expected',
        lspProvider,
        ...params,
      }),
    )

  beforeEach(() => {
    jest.clearAllMocks()
    lspProvider = mock<LspProvider>()
    lspProvider.translateToLsp.mockImplementation(async (value) => `${String(value)}\n`)
  })

  it('should translate inputs, user output, and expected output', async () => {
    const { result } = Hook({
      inputs: ['first', 'second'],
      userOutput: 'user-result',
      expectedOutput: 'expected-result',
    })

    await waitFor(() => {
      expect(result.current.translatedInputs).toBe('first second')
      expect(result.current.translatedUserOutput).toBe('user-result')
      expect(result.current.translatedExpectedOutput).toBe('expected-result')
    })

    expect(lspProvider.translateToLsp).toHaveBeenCalledWith('first')
    expect(lspProvider.translateToLsp).toHaveBeenCalledWith('second')
    expect(lspProvider.translateToLsp).toHaveBeenCalledWith('user-result')
    expect(lspProvider.translateToLsp).toHaveBeenCalledWith('expected-result')
  })

  it('should keep inputs as sem entrada and user output empty when data is missing', async () => {
    const { result } = Hook({
      inputs: [],
      userOutput: undefined,
    })

    await waitFor(() => {
      expect(result.current.translatedInputs).toBe('sem entrada')
      expect(result.current.translatedUserOutput).toBe('')
      expect(result.current.translatedExpectedOutput).toBe('expected')
    })

    expect(lspProvider.translateToLsp).toHaveBeenCalledTimes(1)
    expect(lspProvider.translateToLsp).toHaveBeenCalledWith('expected')
  })

  it('should auto open when the test case has user output and is available to inspect', async () => {
    const unlocked = Hook({ isLocked: false, userOutput: 'output' })
    const lockedButCorrect = Hook({
      isLocked: true,
      isCorrect: true,
      userOutput: 'output',
    })

    await waitFor(() => {
      expect(unlocked.result.current.isOpen).toBe(true)
      expect(lockedButCorrect.result.current.isOpen).toBe(true)
    })
  })

  it('should toggle the accordion state manually', async () => {
    const { result } = Hook()

    await waitFor(() => {
      expect(result.current.translatedExpectedOutput).toBe('expected')
    })

    act(() => {
      result.current.handleButtonClick()
    })

    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.handleButtonClick()
    })

    expect(result.current.isOpen).toBe(false)
  })
})
