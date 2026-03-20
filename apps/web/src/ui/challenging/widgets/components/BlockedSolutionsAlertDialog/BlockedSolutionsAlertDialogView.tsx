import type { ReactNode } from 'react'

import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Button } from '@/ui/global/widgets/components/Button'

type Props = {
  trigger: ReactNode
  coins: number
  canAcquireSolutions: boolean
  onShowSolutions: () => void
}

export const BlockedSolutionsAlertDialogView = ({
  trigger,
  coins,
  canAcquireSolutions,
  onShowSolutions,
}: Props) => {
  return (
    <AlertDialog
      type='denying'
      title='Opa!'
      body={
        <div>
          <p className='text-center leading-8 text-gray-100'>
            Para ver as soluções de outros usuários para esse desafio você deve pagar{' '}
            <span className='font-medium text-yellow-400'>10 de starcoins</span> em troca.
            Você possui atualmente {coins} de starcoins.{' '}
            {canAcquireSolutions &&
              `Contudo, você não será mais apto a ganhar recompensas ao terminar esse
            desafio.`}
          </p>
          <p className='my-4 text-center uppercase text-red-500'>
            Você tem certeza que deseja continuar?
          </p>
        </div>
      }
      action={<Button onClick={onShowSolutions}>Entendido</Button>}
      cancel={<Button className='bg-red-500 text-gray-100'>Cancelar</Button>}
    >
      {trigger}
    </AlertDialog>
  )
}
