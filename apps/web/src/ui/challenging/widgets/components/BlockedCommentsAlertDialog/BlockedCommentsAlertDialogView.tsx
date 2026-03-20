import type { ReactNode } from 'react'

import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Button } from '@/ui/global/widgets/components/Button'

type Props = {
  trigger: ReactNode
}

export const BlockedCommentsAlertDialogView = ({ trigger }: Props) => {
  return (
    <AlertDialog
      type='denying'
      title='Negado!'
      body={
        <p className='text-center leading-8 text-gray-100'>
          Você só pode ver os comentários de outros usuários apenas após a conclusão do
          desafio.
        </p>
      }
      action={<Button>Entendido</Button>}
    >
      {trigger}
    </AlertDialog>
  )
}
