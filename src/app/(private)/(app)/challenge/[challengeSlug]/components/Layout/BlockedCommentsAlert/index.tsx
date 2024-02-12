import { ReactNode } from 'react'

import { AlertDialog } from '@/global/components/AlertDialog'
import { Button } from '@/global/components/Button'

type BlockedCommentsAlertDialogProps = {
  children: ReactNode
}

export function BlockedCommentsAlertDialog({
  children: trigger,
}: BlockedCommentsAlertDialogProps) {
  return (
    <AlertDialog
      type="denying"
      title="Negado!"
      body={
        <p className="text-center leading-8 text-gray-100">
          Você só pode ver os comentários de outros usuários apenas após a
          conclusão do desafio.
        </p>
      }
      action={<Button>Entendido</Button>}
    >
      {trigger}
    </AlertDialog>
  )
}
