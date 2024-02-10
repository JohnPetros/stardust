import { ReactNode } from 'react'

import { Alert } from '@/global/components/Alert'
import { Button } from '@/global/components/Button'

type BlockedCommentsAlertProps = {
  children: ReactNode
  onShowSolutions: () => void
}

export function BlockedSolutionsAlert({
  children: trigger,
  onShowSolutions,
}: BlockedCommentsAlertProps) {
  return (
    <Alert
      type="denying"
      title="Opa!"
      body={
        <div>
          <p className="text-center leading-8 text-gray-100">
            Para ver as soluções de outros usuários para esse desafio você deve
            pagar{' '}
            <span className="font-medium text-yellow-400">
              10 de poeira estelar
            </span>{' '}
            em troca. Contudo, você não será mais apto a ganhar recompensas ao
            terminar esse desafio.
          </p>
          <p className="my-4 text-center uppercase text-red-500">
            Você tem certeza que deseja continuar?
          </p>
        </div>
      }
      action={<Button onClick={onShowSolutions}>Entendido</Button>}
      cancel={<Button className="bg-red-500 text-gray-100">Cancelar</Button>}
    >
      {trigger}
    </Alert>
  )
}
