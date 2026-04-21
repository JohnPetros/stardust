import { ApiKeyItem } from '../ApiKeyItem'
import type { ApiKey } from '../types'

type Props = {
  apiKeys: ApiKey[]
  isLoading: boolean
  renamingApiKeyId: string | null
  revokingApiKeyId: string | null
  onRenameApiKey: (apiKeyId: string, name: string) => Promise<boolean>
  onRevokeApiKey: (apiKeyId: string) => Promise<boolean>
}

export const ApiKeysListView = ({
  apiKeys,
  isLoading,
  renamingApiKeyId,
  revokingApiKeyId,
  onRenameApiKey,
  onRevokeApiKey,
}: Props) => {
  if (isLoading) {
    return <p className='py-4 text-sm text-[#9cb1aa]'>Carregando API keys...</p>
  }

  if (apiKeys.length === 0) {
    return (
      <p className='rounded-md border border-dashed border-[#1e2a2c] bg-[#060a0c] px-4 py-8 text-center text-sm text-[#9cb1aa]'>
        Você ainda não criou nenhuma API key.
      </p>
    )
  }

  return (
    <>
      <ul className='space-y-3 md:hidden'>
        {apiKeys.map((apiKey) => (
          <ApiKeyItem
            key={apiKey.id}
            apiKey={apiKey}
            variant='card'
            isRenaming={renamingApiKeyId === apiKey.id}
            isRevoking={revokingApiKeyId === apiKey.id}
            onRenameApiKey={onRenameApiKey}
            onRevokeApiKey={onRevokeApiKey}
          />
        ))}
      </ul>

      <div className='hidden overflow-x-auto rounded-md border border-[#1e2a2c] bg-[#070d0f] md:block'>
        <table className='w-full min-w-[760px] text-sm'>
          <thead className='border-b border-[#1e2a2c] bg-[#0a1214] text-[11px] uppercase tracking-[0.08em] text-[#9cb1aa]'>
            <tr>
              <th className='px-4 py-3 text-left font-semibold'>Nome</th>
              <th className='px-4 py-3 text-left font-semibold'>Preview</th>
              <th className='px-4 py-3 text-left font-semibold'>Criada em</th>
              <th className='px-4 py-3 text-left font-semibold'>Ações</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.map((apiKey) => (
              <ApiKeyItem
                key={apiKey.id}
                apiKey={apiKey}
                variant='table'
                isRenaming={renamingApiKeyId === apiKey.id}
                isRevoking={revokingApiKeyId === apiKey.id}
                onRenameApiKey={onRenameApiKey}
                onRevokeApiKey={onRevokeApiKey}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
