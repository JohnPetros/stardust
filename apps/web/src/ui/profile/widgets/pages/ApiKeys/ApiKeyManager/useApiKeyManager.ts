import { useCallback, useEffect, useMemo, useState } from 'react'
import { Id, Name } from '@stardust/core/global/structures'

import type { AuthService } from '@stardust/core/auth/interfaces'

import { CACHE } from '@/constants'
import { useCache } from '@/ui/global/hooks/useCache'
import type { ApiKey, CreatedApiKey } from './types'

type Params = {
  authService: AuthService
  copyToClipboard: (text: string, successMessage: string) => Promise<void>
  showSuccess: (message: string) => void
  showError: (message: string) => void
}

export function useApiKeyManager({
  authService,
  copyToClipboard,
  showSuccess,
  showError,
}: Params) {
  const [isCreating, setIsCreating] = useState(false)
  const [renamingApiKeyId, setRenamingApiKeyId] = useState<string | null>(null)
  const [revokingApiKeyId, setRevokingApiKeyId] = useState<string | null>(null)
  const [createdApiKey, setCreatedApiKey] = useState<CreatedApiKey | null>(null)

  const {
    data: apiKeysData,
    error,
    isLoading,
    refetch,
    updateCache,
  } = useCache<ApiKey[]>({
    key: CACHE.keys.authApiKeys,
    fetcher: async () => {
      const response = await authService.listApiKeys()
      if (response.isFailure) {
        throw new Error(response.errorMessage)
      }

      return response.body?.items ?? []
    },
    shouldRefetchOnFocus: false,
  })

  const apiKeys = useMemo(() => apiKeysData ?? [], [apiKeysData])

  useEffect(() => {
    if (!error) return
    showError('Não foi possível carregar as API keys.')
  }, [error, showError])

  const handleCreateApiKey = useCallback(
    async (name: string): Promise<boolean> => {
      setIsCreating(true)
      const response = await authService.createApiKey(Name.create(name))
      setIsCreating(false)

      if (response.isFailure || !response.body) {
        showError(response.errorMessage)
        return false
      }

      const newApiKey = response.body

      updateCache(
        [
          {
            id: newApiKey.id,
            name: newApiKey.name,
            keyPreview: newApiKey.keyPreview,
            createdAt: newApiKey.createdAt,
          },
          ...apiKeys.filter((apiKey) => apiKey.id !== newApiKey.id),
        ],
        { shouldRevalidate: false },
      )
      setCreatedApiKey(newApiKey)
      showSuccess('API key criada com sucesso.')

      return true
    },
    [authService, apiKeys, updateCache, showError, showSuccess],
  )

  const handleRenameApiKey = useCallback(
    async (apiKeyId: string, name: string): Promise<boolean> => {
      setRenamingApiKeyId(apiKeyId)
      const response = await authService.renameApiKey(
        Id.create(apiKeyId),
        Name.create(name),
      )
      setRenamingApiKeyId(null)

      if (response.isFailure) {
        showError(response.errorMessage)
        return false
      }

      const updatedApiKey = response.body
      updateCache(
        apiKeys.map((apiKey) =>
          apiKey.id === updatedApiKey.id
            ? {
                ...apiKey,
                name: updatedApiKey.name,
              }
            : apiKey,
        ),
        { shouldRevalidate: false },
      )
      showSuccess('API key renomeada com sucesso.')

      return true
    },
    [authService, apiKeys, updateCache, showError, showSuccess],
  )

  const handleRevokeApiKey = useCallback(
    async (apiKeyId: string): Promise<boolean> => {
      setRevokingApiKeyId(apiKeyId)
      const response = await authService.revokeApiKey(Id.create(apiKeyId))
      setRevokingApiKeyId(null)

      if (response.isFailure) {
        showError(response.errorMessage)
        return false
      }

      updateCache(
        apiKeys.filter((apiKey) => apiKey.id !== apiKeyId),
        { shouldRevalidate: false },
      )
      showSuccess('API key revogada com sucesso.')

      return true
    },
    [authService, apiKeys, updateCache, showError, showSuccess],
  )

  const handleCreatedApiKeyDialogClose = useCallback(() => {
    setCreatedApiKey(null)
  }, [])

  const handleCopyCreatedApiKeySecret = useCallback(async () => {
    if (!createdApiKey) return

    await copyToClipboard(
      createdApiKey.key,
      'Chave secreta copiada. Salve em um local seguro.',
    )
  }, [copyToClipboard, createdApiKey])

  return {
    apiKeys,
    createdApiKey,
    isLoading,
    isCreating,
    renamingApiKeyId,
    revokingApiKeyId,
    handleCreateApiKey,
    handleRenameApiKey,
    handleRevokeApiKey,
    handleCreatedApiKeyDialogClose,
    handleCopyCreatedApiKeySecret,
    refreshApiKeys: refetch,
  }
}
