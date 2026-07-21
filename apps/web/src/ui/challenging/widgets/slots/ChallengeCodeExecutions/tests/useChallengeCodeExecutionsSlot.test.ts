import { renderHook, waitFor } from '@testing-library/react'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { PaginationResponse, RestResponse } from '@stardust/core/global/responses'
import { ChallengeCodeExecution } from '@stardust/core/challenging/structures'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useChallengeCodeExecutionsSlot } from '../useChallengeCodeExecutionsSlot'

jest.mock('@/ui/challenging/stores/ChallengeStore')

describe('useChallengeCodeExecutionsSlot', () => {
  const challengeId = 'f4d46740-60f9-4a2d-b7a3-9cbe6f854efe'
  const replaceCurrentCodeWithExecution = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useChallengeStore).mockReturnValue({
      getCodeExecutionSlice: () => ({ replaceCurrentCodeWithExecution }),
    } as never)
  })

  it('should expose the sign-in state when the executions request is unauthorized', async () => {
    const challengingService = {
      fetchChallengeCodeExecutions: jest.fn().mockResolvedValue(
        new RestResponse({
          errorMessage: 'Conta não autorizada',
          statusCode: HTTP_STATUS_CODE.unauthorized,
        }),
      ),
    }

    const { result } = renderHook(() =>
      useChallengeCodeExecutionsSlot({
        challengingService: challengingService as never,
        challengeId,
        isAccountAuthenticated: true,
      }),
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.canAccessExecutions).toBe(false)
    expect(result.current.isFailure).toBe(false)
  })

  it('should not fetch executions without an authenticated account', () => {
    const challengingService = {
      fetchChallengeCodeExecutions: jest.fn(),
    }

    const { result } = renderHook(() =>
      useChallengeCodeExecutionsSlot({
        challengingService: challengingService as never,
        challengeId,
        isAccountAuthenticated: false,
      }),
    )

    expect(challengingService.fetchChallengeCodeExecutions).not.toHaveBeenCalled()
    expect(result.current.canAccessExecutions).toBe(false)
    expect(result.current.isFailure).toBe(false)
  })

  it('should fetch executions on mount and map them to domain structures', async () => {
    const executionDto = {
      code: 'escreva("Olá")',
      status: 'accepted',
      testResults: [{ position: 1, isCorrect: true, userOutput: 1, expectedOutput: 1 }],
      outputs: [],
      error: null,
      createdAt: '2026-07-17T03:19:31.000Z',
    }
    const challengingService = {
      fetchChallengeCodeExecutions: jest.fn().mockResolvedValue(
        new RestResponse({
          body: new PaginationResponse({
            items: [executionDto],
            totalItemsCount: 1,
            itemsPerPage: 20,
            page: 1,
          }),
        }),
      ),
    }

    const { result } = renderHook(() =>
      useChallengeCodeExecutionsSlot({
        challengingService: challengingService as never,
        challengeId,
        isAccountAuthenticated: true,
      }),
    )

    await waitFor(() => expect(result.current.executions).toHaveLength(1))

    expect(result.current.executions[0]).toBeInstanceOf(ChallengeCodeExecution)
    expect(result.current.totalItemsCount).toBe(1)
    expect(challengingService.fetchChallengeCodeExecutions).toHaveBeenCalledWith({
      challengeId: expect.any(Object),
      page: expect.objectContaining({ value: 1 }),
      itemsPerPage: expect.objectContaining({ value: 20 }),
    })
  })

  it('should fetch a selected page', async () => {
    const challengingService = {
      fetchChallengeCodeExecutions: jest.fn().mockResolvedValue(
        new RestResponse({
          body: new PaginationResponse({
            items: [],
            totalItemsCount: 0,
            itemsPerPage: 20,
            page: 2,
          }),
        }),
      ),
    }

    const { result } = renderHook(() =>
      useChallengeCodeExecutionsSlot({
        challengingService: challengingService as never,
        challengeId,
        isAccountAuthenticated: true,
      }),
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    result.current.handlePageChange(2)

    await waitFor(() =>
      expect(challengingService.fetchChallengeCodeExecutions).toHaveBeenLastCalledWith({
        challengeId: expect.any(Object),
        page: expect.objectContaining({ value: 2 }),
        itemsPerPage: expect.objectContaining({ value: 20 }),
      }),
    )
  })

  it('should expose failure state and retry after a non-auth request failure', async () => {
    const challengingService = {
      fetchChallengeCodeExecutions: jest
        .fn()
        .mockResolvedValueOnce(
          new RestResponse({
            errorMessage: 'Falha',
            statusCode: HTTP_STATUS_CODE.serverError,
          }),
        )
        .mockResolvedValueOnce(
          new RestResponse({
            body: new PaginationResponse({
              items: [],
              totalItemsCount: 0,
              itemsPerPage: 20,
              page: 1,
            }),
          }),
        ),
    }

    const { result } = renderHook(() =>
      useChallengeCodeExecutionsSlot({
        challengingService: challengingService as never,
        challengeId,
        isAccountAuthenticated: true,
      }),
    )

    await waitFor(() => expect(result.current.isFailure).toBe(true))

    result.current.handleRetry()

    await waitFor(() => expect(result.current.isFailure).toBe(false))
  })

  it('should replace current editor code with a selected execution code', () => {
    const challengingService = {
      fetchChallengeCodeExecutions: jest.fn(),
    }
    const execution = ChallengeCodeExecution.create({
      code: 'escreva("Olá")',
      status: 'accepted',
      testResults: [],
      outputs: [],
      error: null,
    })

    const { result } = renderHook(() =>
      useChallengeCodeExecutionsSlot({
        challengingService: challengingService as never,
        challengeId,
        isAccountAuthenticated: false,
      }),
    )

    result.current.handleUseExecutionCode(execution)

    expect(replaceCurrentCodeWithExecution).toHaveBeenCalledWith(execution)
  })
})
