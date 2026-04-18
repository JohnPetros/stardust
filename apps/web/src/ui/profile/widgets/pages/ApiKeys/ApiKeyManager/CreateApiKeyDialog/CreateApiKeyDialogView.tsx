import type { PropsWithChildren } from 'react'

import { Button } from '@/ui/global/widgets/components/Button'
import * as Dialog from '@/ui/global/widgets/components/Dialog'
import type { CreatedApiKey } from '../types'

type Props = {
  isOpen: boolean
  name: string
  errorMessage: string
  isCreating: boolean
  createdApiKey: CreatedApiKey | null
  onOpenChange: (isOpen: boolean) => void
  onNameChange: (name: string) => void
  onCreateClick: () => Promise<void>
  onCopyCreatedApiKeySecret: () => Promise<void>
}

export const CreateApiKeyDialogView = ({
  children,
  isOpen,
  name,
  errorMessage,
  isCreating,
  createdApiKey,
  onOpenChange,
  onNameChange,
  onCreateClick,
  onCopyCreatedApiKeySecret,
}: PropsWithChildren<Props>) => {
  return (
    <Dialog.Container open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger className='w-auto'>{children}</Dialog.Trigger>
      <Dialog.Content className='max-w-[680px] p-4 md:p-6'>
        <div className='rounded-xl border border-[#1e2a2c] bg-[#0a1011] p-6 md:p-7'>
          <Dialog.Header className='border-b-[#1e2a2c] pb-4'>
            <div className='space-y-1'>
              <p className='text-[11px] font-bold uppercase tracking-[0.08em] text-[#00f58a]'>
                Nova chave de API
              </p>
              <span className='text-lg font-semibold text-[#ecfff6] md:text-2xl'>
                Gerar credencial para integrações StarDust
              </span>
            </div>
          </Dialog.Header>

          {!createdApiKey && (
            <div className='mt-5'>
              <p className='mb-5 text-sm leading-relaxed text-[#9cb1aa]'>
                Informe um nome descritivo para identificar onde essa chave será usada. O
                valor completo aparecerá apenas uma vez após a criação.
              </p>

              <label className='block'>
                <span className='mb-2 block text-xs font-semibold text-[#b0b8b5]'>
                  Nome da chave
                </span>
                <input
                  type='text'
                  value={name}
                  maxLength={100}
                  onChange={({ currentTarget }) => onNameChange(currentTarget.value)}
                  className='h-11 w-full rounded-md border border-[#2a3436] bg-[#12191b] px-3 text-sm text-[#eafff4] outline-none transition-colors focus:border-[#00f58a]'
                />
              </label>
              {errorMessage && (
                <p className='mt-2 text-xs text-red-400'>{errorMessage}</p>
              )}

              <div className='mt-6 flex justify-between gap-3'>
                <Dialog.Close asChild>
                  <Button className='h-9 w-max rounded-md bg-[#1a2425] px-4 text-[#d2d8d5] hover:brightness-110'>
                    Cancelar
                  </Button>
                </Dialog.Close>
                <Button
                  className='h-9 w-max rounded-md bg-[#00f58a] px-4 text-[#072118] hover:brightness-90'
                  isLoading={isCreating}
                  onClick={onCreateClick}
                >
                  Criar chave
                </Button>
              </div>
            </div>
          )}

          {createdApiKey && (
            <div className='mt-5'>
              <div className='rounded-md border border-[#00f58a] bg-[#0f1617] p-4'>
                <p className='text-xs font-semibold text-[#adffd9]'>Valor da chave</p>
                <div className='mt-2 flex items-center justify-between gap-2 rounded-md border border-[#2a3436] bg-[#060b0c] px-3 py-2'>
                  <code className='min-w-0 break-all font-mono text-xs text-[#d9f8ea]'>
                    {createdApiKey.key}
                  </code>
                  <Button
                    className='h-7 w-max rounded-sm bg-[#00f58a] px-3 text-[11px] font-semibold text-[#072118]'
                    onClick={onCopyCreatedApiKeySecret}
                  >
                    Copiar
                  </Button>
                </div>
                <p className='mt-3 text-xs leading-relaxed text-[#9cb1aa]'>
                  Copie agora. Depois do fechamento, apenas o preview mascarado ficará
                  disponível na listagem.
                </p>
              </div>

              <p className='mt-4 text-sm text-[#d2d8d5]'>
                Esta é a única vez que você verá a chave secreta completa.
              </p>

              <div className='mt-5 flex justify-between gap-3'>
                <Dialog.Close asChild>
                  <Button className='h-9 w-max rounded-md bg-[#00f58a] px-4 text-[#072118] hover:brightness-90'>
                    Fechar chave
                  </Button>
                </Dialog.Close>
              </div>
            </div>
          )}
        </div>
      </Dialog.Content>
    </Dialog.Container>
  )
}
