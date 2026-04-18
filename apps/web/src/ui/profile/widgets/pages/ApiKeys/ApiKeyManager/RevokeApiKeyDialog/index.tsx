import type { PropsWithChildren } from 'react'

import { RevokeApiKeyDialogView } from './RevokeApiKeyDialogView'

type Props = {
  apiKeyName: string
  isRevoking: boolean
  onRevokeApiKey: () => Promise<boolean>
}

export const RevokeApiKeyDialog = ({
  children,
  apiKeyName,
  isRevoking,
  onRevokeApiKey,
}: PropsWithChildren<Props>) => {
  return (
    <RevokeApiKeyDialogView
      apiKeyName={apiKeyName}
      isRevoking={isRevoking}
      onRevokeApiKey={onRevokeApiKey}
    >
      {children}
    </RevokeApiKeyDialogView>
  )
}
