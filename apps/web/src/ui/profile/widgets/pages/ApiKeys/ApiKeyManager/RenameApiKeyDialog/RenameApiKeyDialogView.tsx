import type { PropsWithChildren } from 'react'

import { Button } from '@/ui/global/widgets/components/Button'
import * as Dialog from '@/ui/global/widgets/components/Dialog'
import { Input } from '@/ui/global/widgets/components/Input'

type Props = {
  isOpen: boolean
  name: string
  errorMessage: string
  isRenaming: boolean
  onOpenChange: (isOpen: boolean) => void
  onNameChange: (name: string) => void
  onRenameClick: () => Promise<void>
}

export const RenameApiKeyDialogView = ({
  children,
  isOpen,
  name,
  errorMessage,
  isRenaming,
  onOpenChange,
  onNameChange,
  onRenameClick,
}: PropsWithChildren<Props>) => {
  return (
    <Dialog.Container open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger className='w-auto'>{children}</Dialog.Trigger>
      <Dialog.Content className='max-w-md'>
        <div className='rounded-md border border-[#1e2a2c] bg-[#0a1011] p-6'>
          <Dialog.Header className='border-b-[#1e2a2c]'>
            <span className='text-[#ecfff6]'>Renomear API key</span>
          </Dialog.Header>

          <div className='mt-4'>
            <Input
              type='text'
              label='Nome da chave'
              value={name}
              maxLength={100}
              errorMessage={errorMessage || undefined}
              onChange={({ currentTarget }) => onNameChange(currentTarget.value)}
            />

            <div className='mt-6 flex justify-between gap-2'>
              <Dialog.Close asChild>
                <Button className='h-9 w-max rounded-md bg-[#1a2425] px-4 text-[#d2d8d5]'>
                  Cancelar
                </Button>
              </Dialog.Close>
              <Button
                className='h-9 w-max rounded-md bg-[#00f58a] px-4 text-[#072118]'
                isLoading={isRenaming}
                onClick={onRenameClick}
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Container>
  )
}
