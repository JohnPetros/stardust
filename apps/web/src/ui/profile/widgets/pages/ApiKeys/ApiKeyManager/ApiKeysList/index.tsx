import { ApiKeysListView } from './ApiKeysListView'
import type { ApiKey } from '../types'

type Props = {
  apiKeys: ApiKey[]
  isLoading: boolean
  renamingApiKeyId: string | null
  revokingApiKeyId: string | null
  onRenameApiKey: (apiKeyId: string, name: string) => Promise<boolean>
  onRevokeApiKey: (apiKeyId: string) => Promise<boolean>
}

export const ApiKeysList = ({
  apiKeys,
  isLoading,
  renamingApiKeyId,
  revokingApiKeyId,
  onRenameApiKey,
  onRevokeApiKey,
}: Props) => {
  return (
    <ApiKeysListView
      apiKeys={apiKeys}
      isLoading={isLoading}
      renamingApiKeyId={renamingApiKeyId}
      revokingApiKeyId={revokingApiKeyId}
      onRenameApiKey={onRenameApiKey}
      onRevokeApiKey={onRevokeApiKey}
    />
  )
}
