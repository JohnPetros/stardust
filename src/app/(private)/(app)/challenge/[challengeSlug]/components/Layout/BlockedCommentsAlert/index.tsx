import { ReactNode } from 'react'

import { Alert } from '@/app/components/Alert'
import { Button } from '@/app/components/Button'

type BlockedCommentsAlertProps = {
  children: ReactNode
}

export function BlockedCommentsAlert({
  children: trigger,
}: BlockedCommentsAlertProps) {
  return (
    <Alert
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
    </Alert>
  )
}
