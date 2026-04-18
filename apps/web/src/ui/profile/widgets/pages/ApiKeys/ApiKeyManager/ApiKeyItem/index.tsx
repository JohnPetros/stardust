import { Datetime } from '@stardust/core/global/libs'

import { ApiKeyItemView } from './ApiKeyItemView'
import type { ApiKey } from '../types'

type Props = {
  apiKey: ApiKey
  variant?: 'table' | 'card'
  isRenaming: boolean
  isRevoking: boolean
  onRenameApiKey: (apiKeyId: string, name: string) => Promise<boolean>
  onRevokeApiKey: (apiKeyId: string) => Promise<boolean>
}

export const ApiKeyItem = ({
  apiKey,
  variant = 'table',
  isRenaming,
  isRevoking,
  onRenameApiKey,
  onRevokeApiKey,
}: Props) => {
  const createdAt = new Datetime(new Date(apiKey.createdAt)).format('DD/MM/YYYY')

  return (
    <ApiKeyItemView
      apiKeyId={apiKey.id}
      name={apiKey.name}
      keyPreview={apiKey.keyPreview}
      createdAt={createdAt}
      variant={variant}
      isRenaming={isRenaming}
      isRevoking={isRevoking}
      onRenameApiKey={onRenameApiKey}
      onRevokeApiKey={onRevokeApiKey}
    />
  )
}
