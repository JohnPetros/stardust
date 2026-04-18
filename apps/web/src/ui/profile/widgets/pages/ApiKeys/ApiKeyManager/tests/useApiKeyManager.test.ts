import React, { type PropsWithChildren } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { type Mock, mock } from 'ts-jest-mocker'
import { SWRConfig } from 'swr'

import type { AuthService } from '@stardust/core/auth/interfaces'
import { ListResponse, RestResponse } from '@stardust/core/global/responses'

import { useApiKeyManager } from '../useApiKeyManager'

type RestResponseProps<T> = {
  body?: T
  statusCode?: number
  errorMessage?: string
}

function createRestResponse<T>(props: RestResponseProps<T>) {
  return new RestResponse<T>(props)
}

const swrWrapper = ({ children }: PropsWithChildren) =>
  React.createElement(SWRConfig, {
    value: { provider: () => new Map(), dedupingInterval: 0 },
    children,
  })

describe('useApiKeyManager', () => {
  let authService: Mock<AuthService>
  let copyToClipboard: jest.Mock<Promise<void>, [string, string]>
  let showSuccess: jest.Mock
  let showError: jest.Mock

  const Hook = () =>
    renderHook(
      () =>
        useApiKeyManager({
          authService,
          copyToClipboard,
          showSuccess,
          showError,
        }),
      { wrapper: swrWrapper },
    )

  beforeEach(() => {
    authService = mock<AuthService>()
    copyToClipboard = jest.fn().mockResolvedValue(undefined)
    showSuccess = jest.fn()
    showError = jest.fn()

    authService.listApiKeys.mockResolvedValue(
      createRestResponse({ body: new ListResponse({ items: [] }), statusCode: 200 }),
    )
    authService.createApiKey.mockResolvedValue(
      createRestResponse({
        body: {
          id: '9b948f4d-b777-41ca-bd90-e2fdc3eaa4ea',
          name: 'Nova chave',
          keyPreview: 'sk_123...cdef',
          createdAt: new Date('2026-04-18T12:00:00Z'),
          key: 'sk_secret',
        },
        statusCode: 201,
      }),
    )
    authService.renameApiKey.mockResolvedValue(
      createRestResponse({
        body: {
          id: '11111111-1111-4111-8111-111111111111',
          name: 'Nome atualizado',
          keyPreview: 'sk_abc...1234',
          createdAt: new Date('2026-04-17T12:00:00Z'),
        },
        statusCode: 200,
      }),
    )
    authService.revokeApiKey.mockResolvedValue(createRestResponse({ statusCode: 204 }))
  })

  it('should fetch api keys on mount', async () => {
    authService.listApiKeys.mockResolvedValueOnce(
      createRestResponse({
        body: new ListResponse({
          items: [
            {
              id: '11111111-1111-4111-8111-111111111111',
              name: 'Chave principal',
              keyPreview: 'sk_abc...1234',
              createdAt: new Date('2026-04-17T12:00:00Z'),
            },
          ],
        }),
        statusCode: 200,
      }),
    )

    const { result } = Hook()

    await waitFor(() => expect(result.current.apiKeys).toHaveLength(1))

    expect(result.current.apiKeys[0]).toEqual({
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Chave principal',
      keyPreview: 'sk_abc...1234',
      createdAt: new Date('2026-04-17T12:00:00Z'),
    })
  })

  it('should show an error when initial loading fails', async () => {
    authService.listApiKeys.mockResolvedValueOnce(
      createRestResponse({ statusCode: 500, errorMessage: 'Erro interno' }),
    )

    Hook()

    await waitFor(() => {
      expect(showError).toHaveBeenCalledWith('Não foi possível carregar as API keys.')
    })
  })

  it('should create an api key, update the cache and expose the secret', async () => {
    authService.listApiKeys.mockResolvedValueOnce(
      createRestResponse({
        body: new ListResponse({
          items: [
            {
              id: 'api-key-1',
              name: 'Antiga',
              keyPreview: 'sk_old...1111',
              createdAt: new Date('2026-04-17T12:00:00Z'),
            },
          ],
        }),
        statusCode: 200,
      }),
    )

    const { result } = Hook()

    await waitFor(() => expect(result.current.apiKeys).toHaveLength(1))

    await act(async () => {
      await result.current.handleCreateApiKey('Nova chave')
    })

    expect(showSuccess).toHaveBeenCalledWith('API key criada com sucesso.')
    expect(result.current.createdApiKey).toEqual({
      id: '9b948f4d-b777-41ca-bd90-e2fdc3eaa4ea',
      name: 'Nova chave',
      keyPreview: 'sk_123...cdef',
      createdAt: new Date('2026-04-18T12:00:00Z'),
      key: 'sk_secret',
    })
    expect(result.current.apiKeys).toEqual([
      {
        id: '9b948f4d-b777-41ca-bd90-e2fdc3eaa4ea',
        name: 'Nova chave',
        keyPreview: 'sk_123...cdef',
        createdAt: new Date('2026-04-18T12:00:00Z'),
      },
      {
        id: 'api-key-1',
        name: 'Antiga',
        keyPreview: 'sk_old...1111',
        createdAt: new Date('2026-04-17T12:00:00Z'),
      },
    ])
  })

  it('should rename an api key and update the local list', async () => {
    authService.listApiKeys.mockResolvedValueOnce(
      createRestResponse({
        body: new ListResponse({
          items: [
            {
              id: '11111111-1111-4111-8111-111111111111',
              name: 'Nome antigo',
              keyPreview: 'sk_abc...1234',
              createdAt: new Date('2026-04-17T12:00:00Z'),
            },
          ],
        }),
        statusCode: 200,
      }),
    )

    const { result } = Hook()

    await waitFor(() => expect(result.current.apiKeys).toHaveLength(1))

    await act(async () => {
      await result.current.handleRenameApiKey(
        '11111111-1111-4111-8111-111111111111',
        'Nome atualizado',
      )
    })

    expect(showSuccess).toHaveBeenCalledWith('API key renomeada com sucesso.')
    expect(result.current.apiKeys[0]?.name).toBe('Nome atualizado')
    expect(result.current.renamingApiKeyId).toBeNull()
  })

  it('should revoke an api key and remove it from the local list', async () => {
    authService.listApiKeys.mockResolvedValueOnce(
      createRestResponse({
        body: new ListResponse({
          items: [
            {
              id: '11111111-1111-4111-8111-111111111111',
              name: 'Primeira',
              keyPreview: 'sk_abc...1234',
              createdAt: new Date('2026-04-17T12:00:00Z'),
            },
            {
              id: '22222222-2222-4222-8222-222222222222',
              name: 'Segunda',
              keyPreview: 'sk_def...5678',
              createdAt: new Date('2026-04-16T12:00:00Z'),
            },
          ],
        }),
        statusCode: 200,
      }),
    )

    const { result } = Hook()

    await waitFor(() => expect(result.current.apiKeys).toHaveLength(2))

    await act(async () => {
      await result.current.handleRevokeApiKey('11111111-1111-4111-8111-111111111111')
    })

    expect(showSuccess).toHaveBeenCalledWith('API key revogada com sucesso.')
    expect(result.current.apiKeys).toEqual([
      {
        id: '22222222-2222-4222-8222-222222222222',
        name: 'Segunda',
        keyPreview: 'sk_def...5678',
        createdAt: new Date('2026-04-16T12:00:00Z'),
      },
    ])
    expect(result.current.revokingApiKeyId).toBeNull()
  })

  it('should copy the created api key secret', async () => {
    const { result } = Hook()

    await act(async () => {
      await result.current.handleCreateApiKey('Nova chave')
    })

    await act(async () => {
      await result.current.handleCopyCreatedApiKeySecret()
    })

    expect(copyToClipboard).toHaveBeenCalledWith(
      'sk_secret',
      'Chave secreta copiada. Salve em um local seguro.',
    )
  })
})
