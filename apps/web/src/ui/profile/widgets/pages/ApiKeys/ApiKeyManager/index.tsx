'use client'

import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { useClipboard } from '@/ui/global/hooks/useClipboard'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { ApiKeyManagerView } from './ApiKeyManagerView'
import { useApiKeyManager } from './useApiKeyManager'

export const ApiKeyManager = () => {
  const { authService } = useRestContext()
  const toast = useToastContext()
  const { copy } = useClipboard()
  const {
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
  } = useApiKeyManager({
    authService,
    copyToClipboard: copy,
    showError: toast.showError,
    showSuccess: toast.showSuccess,
  })

  return (
    <ApiKeyManagerView
      apiKeys={apiKeys}
      createdApiKey={createdApiKey}
      isLoading={isLoading}
      isCreating={isCreating}
      renamingApiKeyId={renamingApiKeyId}
      revokingApiKeyId={revokingApiKeyId}
      onCreateApiKey={handleCreateApiKey}
      onRenameApiKey={handleRenameApiKey}
      onRevokeApiKey={handleRevokeApiKey}
      onCreatedApiKeyDialogClose={handleCreatedApiKeyDialogClose}
      onCopyCreatedApiKeySecret={handleCopyCreatedApiKeySecret}
    />
  )
}
