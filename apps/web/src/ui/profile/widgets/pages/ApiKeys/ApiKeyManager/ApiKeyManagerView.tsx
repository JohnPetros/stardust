import { Button } from '@/ui/global/widgets/components/Button'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { ApiKeysList } from './ApiKeysList'
import { CreateApiKeyDialog } from './CreateApiKeyDialog'
import type { ApiKey, CreatedApiKey } from './types'

type Props = {
  apiKeys: ApiKey[]
  createdApiKey: CreatedApiKey | null
  isLoading: boolean
  isCreating: boolean
  renamingApiKeyId: string | null
  revokingApiKeyId: string | null
  onCreateApiKey: (name: string) => Promise<boolean>
  onRenameApiKey: (apiKeyId: string, name: string) => Promise<boolean>
  onRevokeApiKey: (apiKeyId: string) => Promise<boolean>
  onCreatedApiKeyDialogClose: () => void
  onCopyCreatedApiKeySecret: () => Promise<void>
}

export const ApiKeyManagerView = ({
  apiKeys,
  createdApiKey,
  isLoading,
  isCreating,
  renamingApiKeyId,
  revokingApiKeyId,
  onCreateApiKey,
  onRenameApiKey,
  onRevokeApiKey,
  onCreatedApiKeyDialogClose,
  onCopyCreatedApiKeySecret,
}: Props) => {
  return (
    <section className='rounded-md border border-[#1e2a2c] bg-[#0b1113] p-6 md:p-7'>
      <header className='flex flex-wrap items-start justify-between gap-4 border-b border-[#1e2a2c] pb-5'>
        <div className='space-y-1'>
          <h1 className='text-xl font-semibold text-[#d9f8ea] md:text-2xl'>
            Chaves de API do StarDust
          </h1>
          <p className='text-sm text-[#9cb1aa]'>
            Controle as credenciais usadas para integrar scripts, CLIs e plataformas
            externas.
          </p>
        </div>

        <CreateApiKeyDialog
          isCreating={isCreating}
          createdApiKey={createdApiKey}
          onCreateApiKey={onCreateApiKey}
          onCreatedApiKeyDialogClose={onCreatedApiKeyDialogClose}
          onCopyCreatedApiKeySecret={onCopyCreatedApiKeySecret}
        >
          <Button className='h-9 w-max gap-1 rounded-md bg-[#00f58a] px-4 text-[#072118] hover:brightness-90'>
            <Icon name='plus' size={16} />
            Nova API key
          </Button>
        </CreateApiKeyDialog>
      </header>

      <div className='mt-5 rounded-md border border-[#1e2a2c] bg-[#050a0b] p-4'>
        <p className='text-xs leading-relaxed text-[#9cb1aa] md:text-sm'>
          <span className='mr-2 font-semibold text-[#00f58a]'>Controle de acesso:</span>
          cada chave representa uma credencial de uso externo e aparece mascarada na
          listagem.
        </p>
        <p className='mt-1 text-xs leading-relaxed text-[#9cb1aa] md:text-sm'>
          <span className='mr-2 font-semibold text-[#00f58a]'>Segredo sensível:</span>o
          valor completo é exibido apenas no momento da criação.
        </p>
        <p className='mt-1 text-xs leading-relaxed text-[#9cb1aa] md:text-sm'>
          <span className='mr-2 font-semibold text-[#00f58a]'>Revogação imediata:</span>
          ao revogar, a credencial perde validade e não pode ser reutilizada.
        </p>
      </div>

      <div className='mt-4'>
        <ApiKeysList
          apiKeys={apiKeys}
          isLoading={isLoading}
          renamingApiKeyId={renamingApiKeyId}
          revokingApiKeyId={revokingApiKeyId}
          onRenameApiKey={onRenameApiKey}
          onRevokeApiKey={onRevokeApiKey}
        />
      </div>
    </section>
  )
}
