import type { PropsWithChildren } from 'react'

import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Button } from '@/ui/global/widgets/components/Button'

type Props = {
  apiKeyName: string
  isRevoking: boolean
  onRevokeApiKey: () => Promise<boolean>
}

export const RevokeApiKeyDialogView = ({
  children,
  apiKeyName,
  isRevoking,
  onRevokeApiKey,
}: PropsWithChildren<Props>) => {
  return (
    <AlertDialog
      type='denying'
      title='Revogar API key'
      shouldPlayAudio={false}
      body={
        <p className='px-6 text-center text-sm text-[#d2d8d5]'>
          A chave <strong>{apiKeyName}</strong> será invalidada e não poderá mais ser
          utilizada.
        </p>
      }
      action={
        <Button
          className='w-32 rounded-md bg-[#00f58a] text-[#072118]'
          isLoading={isRevoking}
          onClick={onRevokeApiKey}
        >
          Revogar
        </Button>
      }
      cancel={
        <Button className='w-32 rounded-md bg-[#1a2425] text-[#d2d8d5]'>Cancelar</Button>
      }
    >
      {children}
    </AlertDialog>
  )
}
